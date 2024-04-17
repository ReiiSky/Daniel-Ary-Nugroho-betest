import * as Joi from 'joi';
import {ConstructError} from '../context/error/ConstructError';

export class Username {
  private static readonly validator = Joi.string()
    .lowercase()
    .regex(/^[a-z0-9-]+$/)
    .required()
    .min(4)
    .max(32);
  private constructor(public readonly value: string) {}

  public static new(value: string) {
    const result = Username.validator.validate(value);

    if (result.error) {
      throw new ConstructError(Username.name, value);
    }

    return new Username(result.value);
  }

  public change(newUsername: string) {
    return Username.new(newUsername);
  }

  public clone() {
    return Username.new(this.value);
  }
}
