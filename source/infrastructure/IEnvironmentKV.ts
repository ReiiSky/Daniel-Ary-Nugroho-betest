import {Optional} from '../package/monad/Optional';

export interface IEnvironmentKV {
  getNumber(key: string): Optional<number>;
  getString(key: string): Optional<string>;
}
