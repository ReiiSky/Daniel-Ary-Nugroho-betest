import * as Joi from 'joi';
import {ConstructError} from '../context/error/ConstructError';

export class Email {
  private static readonly validator = Joi.string()
    .email()
    .lowercase()
    .required();
  private constructor(private readonly emailValue: string) {}

  public static new(emailValue: string): Email {
    const result = Email.validator.validate(emailValue);

    if (result.error) {
      throw new ConstructError(Email.name, emailValue);
    }

    return new Email(result.value);
  }
}
