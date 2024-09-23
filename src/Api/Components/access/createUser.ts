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

    // const accessTokenKey = crypto.randomBytes(64).toString('hex');
    // const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    // commented beacuse its giving errors and not in use
    // const { user: createdUser } = await userRepository.createUser(
    //   {
    //     first_name: req.body.first_name,
    //     last_name: req.body.last_name,
    //     email: req.body.email,
    //     date_of_birth: req.body.birthday,
    //     phone: req.body.phone,
    //     password: passwordHash,
    //     gender: req.body.gender,
    //     permissions: req.body.permissions,
    //   } as User,
    //   RoleCode.USER,
    // );

    // // const tokens = await createTokens(createdUser, { ip: "192.168.0.2" }, keystore.primaryKey, keystore.secondaryKey);
    // new SuccessResponse('Signup Successful', {
    //   user: _.pick(createdUser, ['_id', 'first_name', 'last_name', 'email', 'roles'])
    // }).send(res);
  }),
);

export default router;
