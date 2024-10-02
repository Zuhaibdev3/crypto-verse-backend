import Joi from 'joi';

export const WalletValidationSchema = Joi.object().keys({
  walletAddress: Joi.string().required(),
  role: Joi.string().required(),
  type: Joi.string().required(),
}).meta({ className: 'WalletPayloadDTO' });

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

