import Joi from "joi";

export function validateEnum<T extends Record<string, any>>(enumValues: T): T[keyof T][] {
  return Object.values(enumValues);
}

export function JoiEnumValuesValidation(enumObj : any) {
  const values = Object.values(enumObj);
  return Joi.string().valid(...values);
}