import {Optional} from '../../package/monad/Optional';
import {ConstructError} from '../context/error/ConstructError';
import {SNValidator} from './SNValidator';

export class Identifier<T> {
  private constructor(
    public readonly id: T,
    public readonly createdAt: Optional<Date>
  ) {}

  public clone(): Identifier<T> {
    return new Identifier(this.id, this.createdAt);
  }

  public equal(other: Identifier<T>): boolean {
    return this.id === other.id;
  }

  public static new<T>(value: T, createdAt: Optional<Date>): Identifier<T> {
    if (['string', 'number'].indexOf(typeof value) >= 0) {
      SNValidator.validate(Identifier.name, value);
    } else {
      // unsupported type.
      throw new ConstructError(Identifier.name, value);
    }

    return new Identifier(value, createdAt);
  }
}
