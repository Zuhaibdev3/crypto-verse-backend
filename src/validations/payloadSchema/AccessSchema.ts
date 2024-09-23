import Joi from 'joi';

export const AppSigninValidationSchema = Joi.object().keys({
  email: Joi.string().email().min(3).max(50).required(),
  password : Joi.string().min(6).max(500).required(),
}).meta({ className: 'AppSigninPayloadDTO' });

