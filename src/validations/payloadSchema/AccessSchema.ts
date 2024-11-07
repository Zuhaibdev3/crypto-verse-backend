import Joi from 'joi';

export const WalletValidationSchema = Joi.object().keys({
  walletAddress: Joi.string().required(),
  role: Joi.string().required(),
  type: Joi.string().required(),
}).meta({ className: 'WalletPayloadDTO' });

export const SigninValidationSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required()
}).meta({ className: 'SigninPayloadDTO' });

export const SignupValidationSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required()
}).meta({ className: 'SignupPayloadDTO' });

export const ForgotPasswordValidationSchema = Joi.object().keys({
  email: Joi.string().required(),
}).meta({ className: 'ForgotPasswordPayloadDTO' });

export const VerifyOtpValidationSchema = Joi.object().keys({
  email: Joi.string().required(),
  otp: Joi.number().required(),
}).meta({ className: 'VerifyOtpPayloadDTO' });

export const ResetPasswordValidationSchema = Joi.object().keys({
  email: Joi.string().required(),
  newPassword: Joi.string().required(),
}).meta({ className: 'ResetPasswordPayloadDTO' });

export const UpdateWalletDetailValidationSchema = Joi.object({
  fullName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  bio: Joi.string().optional(),
  websiteLink: Joi.string().optional(),
  twitterUserName: Joi.string().optional(),
  discordUserName: Joi.string().optional(),
  instagramUserName: Joi.string().optional(),
  profilePicUrl: Joi.string().optional(),
}).meta({ className: 'UpdateWalletDetailPayloadDTO' });

