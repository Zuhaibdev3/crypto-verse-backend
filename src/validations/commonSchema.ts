import Joi from "joi";

// import { GeoJSONObjectTypes } from '../enums/enums';

import { JoiStringifiedObjectId } from './validator';

export const JoiLocation = () => {

  return Joi.object({
    // type: Joi.string().valid(GeoJSONObjectTypes.point).allow(null).required(),
    coordinates: Joi.array().ordered(
      // Joi.number().min(-180).max(180).allow(null).required(),
      // Joi.number().min(-90).max(90).allow(null).required()
      Joi.number(),
      Joi.number()
    ).required(),
    formattedAddress: Joi.string().required().allow(""),
    street: Joi.string().required().allow(""),
    // zipcode: Joi.string().required().allow("", null),
    zipcode: Joi.alternatives().try(
      Joi.string().allow('', null).required(),
      Joi.number().required()
    ).required(),

    city: Joi.string().optional().allow(""),
    state: Joi.string().optional().allow(""),
    country: Joi.string().optional().allow("")

  }).custom((value: string, helpers) => {
    return value

  }).required()

}

export const CreatedByAndBusinessIdValidationSchema = Joi.object().keys({
  createdBy: JoiStringifiedObjectId().required(),
  businessId: JoiStringifiedObjectId().required(),
}).meta({ className: 'CreatedByAndBusinessIdValidationSchemaDTO' });

