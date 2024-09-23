import { Response, Request, NextFunction } from "express"
import { Types } from 'mongoose';
import asyncHandler from "../../../helpers/async";
// import UserRepo from '../../../database/repository/UserRepo';
// import { BusinessService } from "../business/business.repository";
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import { SuccessResponse, SuccessMsgResponse, TokenRefreshResponse, InternalErrorResponse } from '../../../core/ApiResponse';
import _ from 'lodash';
import { createTokens, generateOTP, getAccessToken, validateTokenData } from '../../../utils/authUtils';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import { comparePassword } from "../../../utils/password";
import JWT from '../../../core/JWT';
// import { validateTokenData, createTokens, getAccessToken } from '../../../utils/authUtils';
import { AccessService } from './access.service'
import Logger from '../../../core/Logger';
import RoleRepo from "../../../database/repository/RoleRepo";
import Role, { RoleCode } from "../../../database/model/Role";

import { selectArray } from "../../../database/repository/UserRepo";
import SERVICE_IDENTIFIER from '../../../identifiers';
import { IAccessService } from './iaccess.service';
import { resolve } from '../../../dependencymanagement';
import IUserRepo from '../../../database/repository/iuser.repository';
import { DatabaseId } from '../../../../types';
import { User } from "../user/user.entity";
import { AppSigninPayloadDTO } from "../../../Interface/payloadInterface";
import { BusinessStatus } from "../../../enums/enums";
import { MfaEnums } from "../../../enums/mfa.enum";
import { IEmailService } from "../../../Services/interfaces/iemail.service";

// import { UserDeviceService } from "../culturefyNotification/userDevice/userDevice.service";
// import { IUserDeviceService } from "../culturefyNotification/userDevice/iuserDevice.service";

export class AccessController {
  getEmailService(): IEmailService {
    return resolve<IEmailService>(SERVICE_IDENTIFIER.EmailService);
  }

  getAccessService(): IAccessService {
    return resolve<IAccessService>(SERVICE_IDENTIFIER.AccessService);
  }

  getUserRepository(): IUserRepo {
    return resolve<IUserRepo>(SERVICE_IDENTIFIER.UserRepo);
  }

  accessService = this.getAccessService();
  UserRepo = this.getUserRepository();
  EmailService = this.getEmailService();


  signup = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      console.log(req.body);

      const user = await this.UserRepo.findByEmail(req.body.email);
      if (user) throw new BadRequestError('User already registered');

      const { tokens, user: createdUser } = await this.accessService.generate('SIGNUP', req.body as User)

      Logger.info("Login Success", { user: _.pick(createdUser, ['_id', 'name', 'role', 'email', 'telegram_id']) })

      new SuccessResponse('Signup Successful', {
        user: _.pick(createdUser, ['_id', 'name', 'email', 'role', 'profilePicUrl', 'stripe_customerId']),
        tokens,
      }).send(res);
    }
  )


  createUser = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

      req.body.createdBy = req.user._id

      const { user } = await this.UserRepo.createUser(req.body, req.body.role)

      Logger.info("Instructor Create Success")
      new SuccessResponse('User Created Successful', {
        user,
      }).send(res);
    }
  )

  // Create a user for business
  createUserBusiness = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

      req.body.createdBy = req.user._id

      const { user } = await this.UserRepo.createUser(req.body, req.body.role)

      Logger.info("Instructor Create Success")
      new SuccessResponse('User Created Successful', {
        user,
      }).send(res);
    }
  )



  // signupWithTelegram = asyncHandler(
  //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     console.log("We are here", req);
  //     const userExist = await this.UserRepo.findByTelegram(req.query.id);
  //     console.log(req.query);
  //     console.log(userExist);

  //     let user, tokens;
  //     if (userExist) {
  //       const { tokens: createdTokens, user: createdUser } = await this.accessService.generate('SIGNIN', userExist as User)
  //       user = createdUser;
  //       tokens = createdTokens;
  //     } else {
  //       const body = {
  //         telegram_id: req.query.id,
  //         name: `${req.query.first_name} ${req.query.last_name}`,
  //         profilePicUrl: req.query.photo_url
  //       }
  //       const { tokens: createdTokens, user: createdUser } = await this.accessService.generate('SIGNUP', body as User)
  //       user = createdUser;
  //       tokens = createdTokens;
  //     }
  //     res.redirect(`https://kingscharts.io?accessToken=${tokens?.accessToken}`)
  //   }
  // )

  signupWithGoogle = async (accessToken: any, refreshToken: any, unknow: any, profile: any, done: any) => {

    const userExist = await this.UserRepo.findByGoogle(profile.id, profile.emails[0].value);
    let user, tokens;
    if (userExist) {
      const { tokens: createdTokens, user: createdUser } = await this.accessService.generate('SIGNIN', userExist as User)
      user = createdUser;
      tokens = createdTokens;
    } else {
      const body = {
        // google_id: profile.id,
        firstName: `${profile.displayName}`,
        email: profile.emails[0].value
      }
      const { tokens: createdTokens, user: createdUser } = await this.accessService.generate('SIGNUP', body as User)
      user = createdUser;
      tokens = createdTokens;
    }
    Logger.info("Login Success", { user: _.pick(user, ['_id', 'role', 'email', 'telegram_id']) })
    return done(null, { user, tokens });
  }

  signin = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const user = await this.UserRepo.findByEmail(req.body.email);
      if (user?.isDeleted == true) throw new BadRequestError('The Account has been suspended, contact your administrator');
      //@ts-ignore
      if (user?.business?.status == BusinessStatus.suspended) throw new BadRequestError('The Account has been suspended, contact your administrator');
      console.log("useruser ==>  ", user);
      // if (!user) throw new BadRequestError('Invalid credentials');
      if (!user) throw new BadRequestError('Email does not exist');
      if (!user.password || !user.email) throw new BadRequestError('Credential not set');
      comparePassword(req.body.password, user.password)
      
      if (user.isMfaVerified) {
        const otp = generateOTP();
        const expirationTime = new Date(new Date().getTime() + 60000);
        if (user.mfaVerificationType == MfaEnums.PHONE) {
          await this.UserRepo.updateInfo(user?._id.toString(), user);
          new SuccessResponse('An OTP has been sent to your phone number for verification.', {
            userId: user?._id,
            mfaType: user.mfaVerificationType,
            phoneNumber: user?.phoneNumber,
          }).send(res);
        }
        else if (user.mfaVerificationType == MfaEnums.EMAIL) {
          await this.notifyUserViaEmail(user, otp);
          user['verificationOtp'] = {
            otp: String(otp),
            expiresAt: expirationTime
          };
          await this.UserRepo.updateInfo(user?._id.toString(), user);
          new SuccessResponse('An OTP has been sent to your email for verification.', {
            userId: user?._id,
            mfaType: user.mfaVerificationType,
            email: user?.email,
          }).send(res);
        }
      } else {
        const { tokens } = await this.accessService.generate('SIGNIN', user as User)
        // Logger.info("Login Success", { user: _.pick(user, selectArray) })
        delete user.password
        new SuccessResponse('Login Success', {
          user: user,
          tokens: tokens,
        }).send(res);
      }

    }
  )

  verifyOtp = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const user = await this.UserRepo.findById(req.body.userId);
      if (user?.isDeleted == true) throw new BadRequestError('The Account has been suspended, contact your administrator');
      //@ts-ignore
      if (user?.business?.status == BusinessStatus.suspended) throw new BadRequestError('The Account has been suspended, contact your administrator');
      console.log("useruser ==>  ", user);
      // if (!user) throw new BadRequestError('Invalid credentials');
      if (!user) throw new BadRequestError('User does not exist');

      const currentTime = new Date();
      const otpExpiresAt = user?.verificationOtp?.expiresAt; // The expiration time stored in the database

      if (!otpExpiresAt) {
        throw new Error('Expiration time is not set.');
      }
      console.log("Current Time (UTC):", currentTime.toISOString());
      console.log("OTP Expiration Time (UTC):", otpExpiresAt?.toISOString());
      //@ts-ignore
      if (currentTime > otpExpiresAt) {
        throw new BadRequestError('OTP has expired');
      } 
      if (user?.verificationOtp?.otp !== String(req.body.otp)) {
        throw new BadRequestError("OTP doesn't match");
      }
      if (user?.verificationOtp?.otp == String(req.body.otp)) {
        // @ts-ignore
        user['verificationOtp'] = null;
        await this.UserRepo.updateInfo(user?._id.toString(), user);
        const { tokens } = await this.accessService.generate('SIGNIN', user as User)
        // Logger.info("Login Success", { user: _.pick(user, selectArray) })
        delete user.password
        new SuccessResponse('Login Success', {
          user: user,
          tokens: tokens,
        }).send(res);
      }
    }
  )

  resendOtp = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const user = await this.UserRepo.findById(req.body.userId);
      if (user?.isDeleted == true) throw new BadRequestError('The Account has been suspended, contact your administrator');
      //@ts-ignore
      if (user?.business?.status == BusinessStatus.suspended) throw new BadRequestError('The Account has been suspended, contact your administrator');
      console.log("useruser ==>  ", user);
      // if (!user) throw new BadRequestError('Invalid credentials');
      if (!user) throw new BadRequestError('User does not exist');

      //@ts-ignore
      if (user.isMfaVerified) {
        const otp = generateOTP();
        const expirationTime = new Date(new Date().getTime() + 60000);
        if (user.mfaVerificationType == MfaEnums.PHONE) {
          await this.UserRepo.updateInfo(user?._id.toString(), user);
          new SuccessResponse('An OTP has been resent to your phone number for verification.', {}).send(res);
        }
        else if (user.mfaVerificationType == MfaEnums.EMAIL) {
          await this.notifyUserViaEmail(user, otp);
          user['verificationOtp'] = {
            otp: String(otp),
            expiresAt: expirationTime
          };
          await this.UserRepo.updateInfo(user?._id.toString(), user);
          new SuccessResponse('An OTP has been resent to your email for verification.', {}).send(res);
        }
      }
    }
  )

  updateUserMfa = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const user = await this.UserRepo.findById(req.user?._id);
      let bodyData: any = req.body;
      // @ts-ignore
      user['isMfaVerified'] = bodyData?.isMfaVerified;
      // @ts-ignore
      user['mfaVerificationType'] = bodyData?.mfaVerificationType;
      // @ts-ignore
      user['phoneNumber'] = bodyData?.phoneNumber;
      // @ts-ignore
      await this.UserRepo.updateInfo(req.user?._id.toString(), user);

      new SuccessResponse('Updated Successfully', user).send(res);
    }
  )

  async notifyUserViaEmail(user: any, otp: Number): Promise<void> {
    await this.EmailService.sendEmailToBulkUsers(
      // @ts-ignore
      [{ address: user?.email }],
      `Your OTP Code for Verification`,
      'html',
      otpEmailTemplate,
      {
        salutation: `Hi ${user?.firstName},`,
        bodyContentPartOne: "We have received a request to verify your identity. Please use the One-Time Password (OTP) provided below to complete your verification process.",
        bodyContentPartTwo: `${otp}`,
        bodyContentPartThree: "This OTP is valid for 60 seconds. Please do not share this code with anyone.",
        bodyContentPartFour: "If you did not request this, please contact our support team immediately.",
        FooterContent: "Thank you",
      },
      []
    );
  }

  appSignin = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      let bodyData: AppSigninPayloadDTO = req.body
      const result = await this.accessService.appSignin(bodyData)
      new SuccessResponse('Login Success', result).send(res);
    }
  )

  loginSuccess = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      if (req.user) {
        // @ts-ignore
        res.redirect(`https://kingscharts.io?accessToken=${req.user?.tokens?.accessToken}`)
      } else {
        new AuthFailureError('Login with google field!')
      }
    }
  )
  signout = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      await KeystoreRepo.removeByClient(req.user?._id);
      new SuccessMsgResponse('Logout success').send(res);
    }
  )

 

  verify = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const tokens = await createTokens(req.user, { ip: "192.168.0.2" }, req.keystore.primaryKey, req.keystore.secondaryKey)
      if (req?.user?.business?.status == BusinessStatus.suspended) throw new BadRequestError('This business suspended');
      delete req.user.password
      new SuccessResponse('verify success', {
        user: req.user, // : _.pick(req.user, ['_id', 'name', 'role', 'email', 'telegram_id', 'profilePicUrl'])
        tokens
      }).send(res);
    }
  )

  getBusinessInstructors = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const result = await this.UserRepo.getRoleIdsByInstructorPermission(req.user.businessId)
      let instructors = []
      if (result?.length && result[0]?.roleIds) {
        instructors = await this.UserRepo.getInstructorsByRoleIds(result[0].roleIds)
      }
      new SuccessResponse('fetch success', {
        instructors
      }).send(res);
    }
  )

  createdByExist = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const users = await this.UserRepo.getUserWithCoursesByBusiness(req.user.business._id)
      delete req.user.password
      new SuccessResponse('fetch success', {
        user: users,
      }).send(res);
    }
  )

  refresh = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

      const accessTokenPayload = await JWT.decode(req.accessToken);
      validateTokenData(accessTokenPayload);

      const user = await this.UserRepo.findById(new Types.ObjectId(accessTokenPayload.sub));
      if (!user) throw new AuthFailureError('User not registered');
      req.user = user;

      const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
      validateTokenData(refreshTokenPayload);

      if (accessTokenPayload.sub !== refreshTokenPayload.sub)
        throw new AuthFailureError('Session Expired Please Login Again');

      const keystore = await KeystoreRepo.find(
        req.user._id,
        accessTokenPayload.prm,
        refreshTokenPayload.prm,
      );

      if (!keystore) throw new AuthFailureError('Session Expired Please Login Again');
      await KeystoreRepo.remove(keystore._id);

      // const accessTokenKey = crypto.randomBytes(64).toString('hex');
      // const refreshTokenKey = crypto.randomBytes(64).toString('hex');

      // await KeystoreRepo.create(req.user._id, accessTokenKey, refreshTokenKey);
      // const tokens = await createTokens(req.user, { ip: "192.168.0.2" }, accessTokenKey, refreshTokenKey);

      const { tokens } = await this.accessService.generate('SIGNIN', req.user as User)

      new TokenRefreshResponse('Token Issued', tokens.accessToken, tokens.refreshToken).send(res);
    }
  )

  getUser = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const user = await this.UserRepo.findById(req.query.userId);
      new SuccessResponse('fetch success', {
        user
      }).send(res)
    }
  )

  getUsers = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

      let query = {}

      if (req.user.role.code !== 'SUPER_ADMIN') {
        query = { business: req.user.business._id }
      }

      const users = await this.UserRepo.find(req.user.role, query);
      new SuccessResponse('fetch success', {
        users
      }).send(res);
    }
  )

  deleteUser = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const user = await this.UserRepo.delete(req.params._id);
      new SuccessResponse('deleted successfully', user).send(res);
    }
  )

  updateMe = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const user = await this.UserRepo.updateInfo(req.user._id, req.body)
      new SuccessResponse('update success', { user }).send(res);
    }
  )

  // businessDetails = asyncHandler(
  //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     const { business } = await this.BusinessService.BusinessSave(req.user._id, req.body)
  //     new SuccessResponse('success', { business }).send(res);
  //   }
  // )

  getSameBusinessUsersByNameDropdown = asyncHandler(
    async (req: any, res: Response): Promise<Response | void> => {
      const businessId: DatabaseId = req.user.business._id
      const userName: string = req.query.name
      const { page = 1, limit = 10 } = req.query
      const user = await this.UserRepo.findByNameAndBusinessId(userName, businessId, +page, +limit);
      new SuccessResponse('fetch success', {
        user
      }).send(res)
    }
  )

}
