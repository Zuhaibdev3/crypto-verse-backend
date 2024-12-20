import express from 'express';
import ApiKeyRepo from '../database/repository/ApiKeyRepo';
import { ForbiddenError } from '../core/ApiError';
import Logger from '../core/Logger';
import schema from './schema';
import validator, { ValidationSource } from '../validations/validator';
import asyncHandler from '../helpers/asyncHandler';

const router = express.Router();

export default router.use(
  validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req: any, res, next) => {
    // @ts-ignore
    req.apiKey = req.headers['x-api-key'].toString();

    const apiKey = await ApiKeyRepo.findByKey(req.apiKey);
    Logger.info(apiKey);

    if (!apiKey) throw new ForbiddenError();
    return next();
  }),
);
