import { Response, NextFunction } from "express"
import asyncHandler from "../../../helpers/async";
import { SuccessResponse, SuccessMsgResponse, TokenRefreshResponse, InternalErrorResponse } from '../../../core/ApiResponse';
import _ from 'lodash';
import { createTokens, } from '../../../utils/authUtils';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import Logger from '../../../core/Logger';
import SERVICE_IDENTIFIER from '../../../identifiers';
import { IAccessService } from './iaccess.service';
import { resolve } from '../../../dependencymanagement';
import IUserRepo from '../../../database/repository/iuser.repository';
import { User } from "../user/user.entity";
import { WalletPayloadDTO, UpdateWalletDetailPayloadDTO } from "../../../Interface/payloadInterface";
import { BadRequestError } from "../../../core/ApiError";
import { comparePassword } from "../../../utils/password";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../../../utils/emailService";

export class AccessController {

  getAccessService(): IAccessService {
    return resolve<IAccessService>(SERVICE_IDENTIFIER.AccessService);
  }

  getUserRepository(): IUserRepo {
    return resolve<IUserRepo>(SERVICE_IDENTIFIER.UserRepo);
  }

  accessService = this.getAccessService();
  UserRepo = this.getUserRepository();

  //user login 
  connectedToWallet = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const bodyData: WalletPayloadDTO = req.body
      const user = await this.UserRepo.findByWalletAddress(bodyData?.walletAddress);
      if (user) {
        const { tokens } = await this.accessService.generate('SIGNIN', user as User)
        new SuccessResponse('Wallet Connected', {
          user: user,
          tokens: tokens,
        }).send(res);
      }
      else {
        const { tokens, user: createdUser } = await this.accessService.generate('SIGNUP', bodyData as WalletPayloadDTO)
        Logger.info("Login Success", { user: _.pick(createdUser, ['_id', 'name', 'role',]) })
        new SuccessResponse('Wallet Connected', {
          user: _.pick(createdUser, ['_id', "walletAddress", "fullName", "role", "profilePicUrl"]),
          tokens,
        }).send(res);
      }
    }
  )

  //super admin login
  signin = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

      const user = await this.UserRepo.findByEmail(req.body.email);

      if (!user) throw new BadRequestError('Invalid credentials');

      if (!user.password || !user.email) throw new BadRequestError('Credential not sent');

      await comparePassword(req.body.password, user.password)

      const { tokens } = await this.accessService.generate('SIGNIN', user as User)

      Logger.info("Login Success", { user: user })

      new SuccessResponse('Login Success', {
        user: user,
        tokens: tokens,
      }).send(res);

    }
  )


  signup = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

      const user = await this.UserRepo.findByEmail(req.body.email);
      if (user) throw new BadRequestError('User already registered');

      const { tokens, user: createdUser } = await this.accessService.generate('SIGNUP', req.body as User)

      Logger.info("Login Success", { user: createdUser })
      new SuccessResponse('Signup Successful', {
        user: createdUser,
        tokens,
      }).send(res);
    }
  )

  verify = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const tokens = await createTokens(req.user, { ip: "192.168.0.2" }, req.keystore.primaryKey, req.keystore.secondaryKey)
      delete req.user.password
      new SuccessResponse('verify success', {
        user: req.user, // : _.pick(req.user, ['_id', 'name', 'role', 'email', 'telegram_id', 'profilePicUrl'])
        tokens
      }).send(res);
    }
  )

  updateProfle = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      let bodyData: UpdateWalletDetailPayloadDTO = req.body
      let { _id } = req.user
      console.log(_id, bodyData, "aaaaaaaaaaaaaaaa")
      let result = await this.UserRepo.updateInfo(_id, bodyData)
      new SuccessResponse('Profile Updated successfully', result).send(res);
    }
  )

  signout = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      await KeystoreRepo.removeByClient(req.user?._id);
      new SuccessMsgResponse('Wallet Disconnected').send(res);
    }
  )
  //forgot password endpoints starts here

  forgotPassword = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

      const user = await this.UserRepo.findByEmail(req.body.email);

      if (!user) throw new BadRequestError('User does not exist!');

      let otp = Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
      let otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in milliseconds

      await this.UserRepo.updateOtp(user._id, otp, otpExpiry);

      // Send OTP email
      if (user.email) await sendOtpEmail(user.email, otp);

      new SuccessMsgResponse(`${user.email}`).send(res);
    }
  )

  verifyOtp = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

      const { email, otp } = req.body;

      const user = await this.UserRepo.findByEmail(email);

      if (!user) throw new BadRequestError('User does not exist!');

      // Check if the OTP matches
      if (user.otp !== Number(otp)) {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
      }

      // Check if the OTP has expired
      if (user.otpExpiry && user.otpExpiry < new Date()) {
        return res.status(400).json({ success: false, message: 'OTP has expired' });
      }

      new SuccessMsgResponse(`OTP verified successfully`).send(res);
    }
  )

  resetPassword = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

      const { email, newPassword } = req.body;

      const user = await this.UserRepo.findByEmail(email);

      if (!user) throw new BadRequestError('User does not exist!');

      if (user.password) {
        const hashedPassword = await bcrypt.hashSync(newPassword, 10);
        await this.UserRepo.updatePassword(user._id, hashedPassword);
      }

      new SuccessMsgResponse(`Password reset successfully`).send(res);

    }
  )

  getUsers = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const users = await this.UserRepo.find({ _id: { $ne: req.user._id } });
      new SuccessResponse('fetch success', {
        data: users
      }).send(res);
    }
  )

  //forgot password endpoints ends here

  // verify = asyncHandler(
  //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     const tokens = await createTokens(req.user, { ip: "192.168.0.2" }, req.keystore.primaryKey, req.keystore.secondaryKey)
  //     delete req.user.password
  //     new SuccessResponse('verify success', {
  //       user: req.user, // : _.pick(req.user, ['_id', 'name', 'role', 'email', 'telegram_id', 'profilePicUrl'])
  //       tokens
  //     }).send(res);
  //   }
  // )

  // refresh = asyncHandler(
  //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

  //     const accessTokenPayload = await JWT.decode(req.accessToken);
  //     validateTokenData(accessTokenPayload);

  //     const user = await this.UserRepo.findById(new Types.ObjectId(accessTokenPayload.sub));
  //     if (!user) throw new AuthFailureError('User not registered');
  //     req.user = user;

  //     const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
  //     validateTokenData(refreshTokenPayload);

  //     if (accessTokenPayload.sub !== refreshTokenPayload.sub)
  //       throw new AuthFailureError('Session Expired Please Login Again');

  //     const keystore = await KeystoreRepo.find(
  //       req.user._id,
  //       accessTokenPayload.prm,
  //       refreshTokenPayload.prm,
  //     );

  //     if (!keystore) throw new AuthFailureError('Session Expired Please Login Again');
  //     await KeystoreRepo.remove(keystore._id);

  //     // const accessTokenKey = crypto.randomBytes(64).toString('hex');
  //     // const refreshTokenKey = crypto.randomBytes(64).toString('hex');

  //     // await KeystoreRepo.create(req.user._id, accessTokenKey, refreshTokenKey);
  //     // const tokens = await createTokens(req.user, { ip: "192.168.0.2" }, accessTokenKey, refreshTokenKey);

  //     const { tokens } = await this.accessService.generate('SIGNIN', req.user as User)

  //     new TokenRefreshResponse('Token Issued', tokens.accessToken, tokens.refreshToken).send(res);
  //   }
  // )

  // getUser = asyncHandler(
  //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     const user = await this.UserRepo.findById(req.query.userId);
  //     new SuccessResponse('fetch success', {
  //       user
  //     }).send(res)
  //   }
  // )



  // deleteUser = asyncHandler(
  //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     const user = await this.UserRepo.delete(req.params._id);
  //     new SuccessResponse('deleted successfully', user).send(res);
  //   }
  // )


}
