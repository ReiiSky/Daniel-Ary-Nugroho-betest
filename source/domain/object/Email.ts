import * as Joi from 'joi';
import {ConstructError} from '../context/error/ConstructError';

export class Email {
  private static readonly validator = Joi.string()
    .email()
    .lowercase()
    .required();
  private constructor(public readonly value: string) {}

  public static new(value: string): Email {
    const validatedValue = Email.validate(value);
    return new Email(validatedValue);
  }

  // TODO: add annotation to identify whether the function
  // will throw an error.
  public static validate(value: string) {
    const result = Email.validator.validate(value);

    if (result.error) {
      throw new ConstructError(Email.name, value);
    }

    return result.value;
  }
}
