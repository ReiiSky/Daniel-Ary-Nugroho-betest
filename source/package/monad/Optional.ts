import {EmptyValue} from '../EmptyValue';

export class Optional<T> {
  private constructor(private readonly value?: T) {}

  public static auto<T>(value: T) {
    const tempOptional = new Optional(value);

    return tempOptional.use(value => value);
  }

  public static some<T>(value: T) {
    return new Optional(value);
  }

  public static none<T>() {
    return new Optional<T>();
  }

  public get isNone() {
    return (
      this.value === null ||
      this.value === undefined ||
      this.value === EmptyValue.DefaultString
    );
  }

  public use<TReturn>(
    func: (value: NonNullable<T>) => TReturn
  ): Optional<TReturn> {
    if (this.isNone) {
      return Optional.none();
    }

    const newValue = func(this.value as NonNullable<T>);
    return Optional.some(newValue);
  }

  public unwrap(defaultValue: T): T {
    if (this.isNone) {
      return defaultValue;
    }

    return this.value as T;
  }

  // unsafe unwrap, use it carefully.
  public forceUnwrap(): T {
    if (this.value === EmptyValue.DefaultString) {
      return this.use(num => num).forceUnwrap() as T;
    }

    // TODO: throw new nullpointer exception.
    return this.value as T;
  }
}
