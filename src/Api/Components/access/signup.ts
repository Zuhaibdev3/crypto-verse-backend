import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../../database/repository/UserRepo';
import { BadRequestError } from '../../../core/ApiError';
import { createTokens } from '../../../utils/authUtils';
import validator from '../../../validations/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { RoleCode } from '../../../database/model/Role';
import { User } from '../user/user.entity';

const router = express.Router();

router.post(
  '/basic',
  validator(schema.signup),
  asyncHandler(async (req: any, res) => {
    const userRepository =  new UserRepo()
    const user = await userRepository.findByEmail(req.body.email);
    if (user) throw new BadRequestError('User already registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const { user: createdUser, keystore } = await userRepository.create(
      {
        firstName: req.body.name,
        email: req.body.email,
        profilePicUrl: req.body.profilePicUrl,
        password: passwordHash,
      } as User,
      accessTokenKey,
      refreshTokenKey,
      RoleCode.USER,
    );

    const tokens = await createTokens(createdUser, { ip: "192.168.0.2" },keystore.primaryKey, keystore.secondaryKey);
    new SuccessResponse('Signup Successful', {
      user: _.pick(createdUser, ['_id', 'name', 'email', 'roles', 'profilePicUrl']),
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
