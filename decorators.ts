import Joi, { ObjectSchema } from 'joi';
import { BadRequestError } from './src/core/ApiError';

export function validate(schemas: ObjectSchema[]) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      if (args.length !== schemas.length) {
        throw new Error(`Number of arguments passed (${args.length}) does not match number of schemas (${schemas.length})`);
      }

      const validationPromises = args.map((arg, index) => {
        return schemas[index].validateAsync(arg);
      });

      const validationResult = await Promise.all(validationPromises);

      const validationErrors = validationResult.reduce((acc, curr) => {
        if (curr.error) {
          acc.push(curr.error);
        }
        return acc;
      }, []);

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join("; "));
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
