import express from 'express';
import { TokenRefreshResponse } from '../../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { Types } from 'mongoose';
import UserRepo from '../../../database/repository/UserRepo';
import { AuthFailureError } from '../../../core/ApiError';
import JWT from '../../../core/JWT';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import crypto from 'crypto';
import { validateTokenData, createTokens, getAccessToken } from '../../../utils/authUtils';
import validator, { ValidationSource } from '../../../validations/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';

const router = express.Router();

router.post(
  '/refresh',
  validator(schema.auth, ValidationSource.HEADER),
  validator(schema.refreshToken),
  asyncHandler(async (req: any, res) => {
    const userRepository =  new UserRepo()
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    const accessTokenPayload = await JWT.decode(req.accessToken);
    validateTokenData(accessTokenPayload);

    const user = await userRepository.findById(new Types.ObjectId(accessTokenPayload.sub));
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

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await KeystoreRepo.create(req.user._id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(req.user, { ip: "192.168.0.2" },accessTokenKey, refreshTokenKey);

    new TokenRefreshResponse('Token Issued', tokens.accessToken, tokens.refreshToken).send(res);
  }),
);

export default router;
