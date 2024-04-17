import {Optional} from '../../package/monad/Optional';

export abstract class BaseEnv {
  constructor(private readonly kv: {[key: string]: string | undefined}) {}

  public getNumber(key: string): Optional<number> {
    const value = this.getString(key);
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
      return Optional.none();
    }

    return Optional.some(parsedValue);
  }

  public getString(key: string): Optional<string> {
    const value = this.kv[key];

    return Optional.auto(value);
  }
}
