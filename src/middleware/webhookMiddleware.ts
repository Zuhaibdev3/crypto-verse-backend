import { Router, Request } from 'express';
import { ProtectedRequest } from 'app-request';
import UserRepo from '../database/repository/UserRepo';
import { AuthFailureError, AccessTokenError, TokenExpiredError } from '../core/ApiError';
import JWT from '../core/JWT';
import KeystoreRepo from '../database/repository/KeystoreRepo';
import { Types } from 'mongoose';
import { getAccessToken, validateTokenData } from '../utils/authUtils';
import validator, { ValidationSource } from '../validations/validator';
import { webhookHeaderSchema } from '../utils/joi.schema';
import asyncHandler from '../helpers/async';

const router = Router();

// accessService = this.getAccessService();


export default router.use(
  validator(webhookHeaderSchema, ValidationSource.HEADER),
  asyncHandler(async (req: any, res, next) => {
    // if(req.headers['x-100ms-key'] == process.env.WEBHOOK_100MS_KEY){
    if (req.headers['x-100ms-key'] == process.env.HMS_ACCESS_KEY) {
      return next()
    } else {
      throw new AuthFailureError('Session Expired Please Login Again');
    }
    // const userRepository =  new UserRepo()
    // req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase
    // try {
    //   const payload = await JWT.validate(req.accessToken);
    //   validateTokenData(payload);
    //   const user = await userRepository.findById(new Types.ObjectId(payload.sub));
    //   if (!user) throw new AuthFailureError('User not registered');
    //   req.user = user;
    //   const keystore = await KeystoreRepo.findforKey(req.user._id, payload.prm);
    //   if (!keystore) throw new AuthFailureError('Session Expired Please Login Again');
    //   req.keystore = keystore;
    //   return next();
    // } catch (e) {
    //   if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
    //   throw e;
    // }
  }),
);