import Joi from 'joi';
import { JoiObjectId } from '../validator';

export const NftLikeSchema = Joi.object({
  action: Joi.string().required(),
}).meta({ className: 'NftLikePayloadDTO' });

// export const UpdateIndustryValidationSchema = Joi.object({
//   name: Joi.string().required(),
// }).meta({ className: 'UpdateIndustryPayloadDTO' });

// export const IndustryIdParamSchema = Joi.object().keys({
//   industryId: JoiObjectId().required(),
// }).meta({ className: 'IndustryIdParamDTO' })

