import Joi from 'joi';
import { JoiAuthBearer } from '../validations/validator';
import { RoleCode } from '../database/model/Role';

export const userCredential = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
})

export const otpCredential = Joi.object().keys({
  otp: Joi.string().required(),
  userId: Joi.string().required(),
})

export const resendOtpCredential = Joi.object().keys({
  userId: Joi.string().required(),
})

export const updateMfaCredential = Joi.object().keys({
  isMfaVerified: Joi.boolean().required(),
  mfaVerificationType: Joi.string().required(),
  phoneNumber: Joi.string().optional(),
})

export const refreshToken = Joi.object().keys({
  refreshToken: Joi.string().required().min(1),
})

//  export const jj =   auth: Joi.object()
//         .keys({
//             authorization: JoiAuthBearer().required(),
//         })
//         .unknown(true)

export const signupSchema = Joi.object().keys({
  name: Joi.string().required().min(3),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
  role: Joi.string().required().valid(RoleCode.USER,)
})

export const apiKeySchema = Joi.object().keys({
  'x-api-key': Joi.string().required(),
}).unknown(true)

export const authBearerSchema = Joi.object().keys({
  authorization: JoiAuthBearer().required(),
}).unknown(true)
export const webhookHeaderSchema = Joi.object().keys({
  'x-100ms-key': Joi.string().required(),
}).unknown(true)
