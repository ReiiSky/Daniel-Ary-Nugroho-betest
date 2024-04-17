import {ConstructError} from '../context/error/ConstructError';
import {SNValidator} from './SNValidator';

export class InformationNumber<T = string | number> {
  private constructor(private readonly value: T) {}

  public static new<T>(value: T): InformationNumber<T> {
    if (['string', 'number'].indexOf(typeof value) >= 0) {
      SNValidator.validate(InformationNumber.name, value);
    } else {
      // unsupported type.
      throw new ConstructError(InformationNumber.name, value);
    }

    return new InformationNumber(value);
  }
}
