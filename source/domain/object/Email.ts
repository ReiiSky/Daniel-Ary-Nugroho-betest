import * as Joi from 'joi';
import {ConstructError} from '../context/error/ConstructError';

export class Email {
  private static readonly validator = Joi.string()
    .email()
    .lowercase()
    .required();
  private constructor(public readonly value: string) {}

  public static new(value: string): Email {
    const result = Email.validator.validate(value);

    if (result.error) {
      throw new ConstructError(Email.name, value);
    }

    return new Email(result.value);
  }
}
