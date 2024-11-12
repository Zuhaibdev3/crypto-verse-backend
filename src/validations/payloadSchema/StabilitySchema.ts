import Joi from 'joi';
import { JoiObjectId } from '../validator';

export const TextToImageValidationSchema = Joi.object({
    steps: Joi.number().required(),
    width: Joi.number().required(),
    height: Joi.number().required(),
    seed: Joi.number().required(),
    cfg_scale: Joi.number().required(),
    samples: Joi.number().required(),
    text_prompts: Joi.array().items(Joi.object().keys({
        text: Joi.string().required(),
        weight: Joi.number().required()
    })).required()
}).meta({ className: 'TextToImagePayloadDTO' });

// export const UpdateIndustryValidationSchema = Joi.object({
//   name: Joi.string().required(),
// }).meta({ className: 'UpdateIndustryPayloadDTO' });

// export const IndustryIdParamSchema = Joi.object().keys({
//   industryId: JoiObjectId().required(),
// }).meta({ className: 'IndustryIdParamDTO' })

