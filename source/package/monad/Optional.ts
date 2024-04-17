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

  private get isNull() {
    return this.value === null || this.value === undefined;
  }

  public use<TReturn>(
    func: (value: NonNullable<T>) => TReturn
  ): Optional<TReturn> {
    if (this.isNull) {
      return Optional.none();
    }

    const newValue = func(this.value as NonNullable<T>);
    return Optional.some(newValue);
  }

  public unwrap(defaultValue: T): T {
    if (this.isNull) {
      return defaultValue;
    }

    return this.value as T;
  }
}
