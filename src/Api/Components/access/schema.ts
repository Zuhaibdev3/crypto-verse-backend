import Joi from 'joi';
import { join } from 'path';
import { JoiAuthBearer } from '../../../validations/validator';
import { RoleCode } from '../../../database/model/Role';

export default {
  userCredential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
  createUser: Joi.object().keys({
    first_name: Joi.string().required().min(3),
    last_name: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    date_of_birth: Joi.string().optional(),
    phone: Joi.string().optional(),
    password: Joi.string().required().min(6),
    role: Joi.string().optional().allow(RoleCode.USER, RoleCode.ADMIN, RoleCode.SUPER_ADMIN, RoleCode.INSTRUCTOR ),
    location: Joi.string().optional(),
    permissions: Joi.array().optional(),
    createdBy: Joi.string().optional(),
    business: Joi.string().required(),
  }),
  signup: Joi.object().keys({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    profilePicUrl: Joi.string().optional().uri(),
  }),
  signup_checkout: Joi.object().keys({
    name: Joi.string().required().min(3),
    telegram: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.allow(),
    price: Joi.allow(),
    checkout_type: Joi.string().required().valid("FIAT", "CRYPTO"),
    product: Joi.string().required()
  }),
  updateInfo: Joi.object().keys({
    name: Joi.string().optional(),
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    date_of_birth: Joi.string().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    country: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    postal_code: Joi.string().optional(),
    bio: Joi.string().optional(),
    gender: Joi.string().optional(),
    skills: Joi.string().optional(),
    website: Joi.string().optional(),
    facebook_link: Joi.string().optional(),
    linkedin_link: Joi.string().optional(),
    instagram_link: Joi.string().optional(),
    twitter_link: Joi.string().optional(),
    lifeExperience: Joi.string().optional(),
    designation: Joi.string().optional(),
    isMentor: Joi.string().optional(),
  })
};
