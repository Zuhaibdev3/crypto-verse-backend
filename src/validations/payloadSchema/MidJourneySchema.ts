import Joi from 'joi';
import { JoiObjectId } from '../validator';

export const MidJourneyValidationSchema = Joi.object({
  prompt: Joi.string().required(),
}).meta({ className: 'MidJourneyPayloadDTO' });

// export const UpdateIndustryValidationSchema = Joi.object({
//   name: Joi.string().required(),
// }).meta({ className: 'UpdateIndustryPayloadDTO' });

// export const IndustryIdParamSchema = Joi.object().keys({
//   industryId: JoiObjectId().required(),
// }).meta({ className: 'IndustryIdParamDTO' })

