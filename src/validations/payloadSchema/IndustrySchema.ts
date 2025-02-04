import Joi from 'joi';
import { JoiObjectId } from '../validator';

export const IndustryValidationSchema = Joi.object({
  name: Joi.string().required(),
}).meta({ className: 'IndustryPayloadDTO' });

export const UpdateIndustryValidationSchema = Joi.object({
  name: Joi.string().required(),
}).meta({ className: 'UpdateIndustryPayloadDTO' });

export const IndustryIdParamSchema = Joi.object().keys({
  industryId: JoiObjectId().required(),
}).meta({ className: 'IndustryIdParamDTO' })

