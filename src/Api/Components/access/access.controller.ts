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

  getAccessService(): IAccessService {
    return resolve<IAccessService>(SERVICE_IDENTIFIER.AccessService);
  }

  getUserRepository(): IUserRepo {
    return resolve<IUserRepo>(SERVICE_IDENTIFIER.UserRepo);
  }

  accessService = this.getAccessService();
  UserRepo = this.getUserRepository();


  signup = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
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
      const { tokens } = await this.accessService.generate('SIGNIN', user as User)
      // Logger.info("Login Success", { user: _.pick(user, selectArray) })
      delete user.password
      new SuccessResponse('Login Success', {
        user: user,
        tokens: tokens,
      }).send(res);

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
      delete req.user.password
      new SuccessResponse('verify success', {
        user: req.user, // : _.pick(req.user, ['_id', 'name', 'role', 'email', 'telegram_id', 'profilePicUrl'])
        tokens
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


}
