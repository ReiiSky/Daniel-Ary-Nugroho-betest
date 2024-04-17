import * as Joi from 'joi';
import {ConstructError} from '../context/error/ConstructError';

// String or Number standard validator.
export abstract class SNValidator {
  constructor() {}
  private static readonly stringValidator = Joi.string()
    .min(4)
    .max(32)
    .required();
  private static readonly numberValidator = Joi.number().min(1).required();

  public static validate<T>(domainName: string, value: T) {
    if (typeof value === 'string') {
      SNValidator.validateValue(domainName, SNValidator.stringValidator, value);
    } else if (typeof value === 'number') {
      SNValidator.validateValue(domainName, SNValidator.numberValidator, value);
    }
  }

  private static validateValue<T>(
    domainName: string,
    schema: Joi.AnySchema,
    value: T
  ) {
    const result = schema.validate(value);

    if (result.error) {
      throw new ConstructError(domainName, value);
    }
  }
}
