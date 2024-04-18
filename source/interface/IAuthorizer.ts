import {Optional} from '../package/monad/Optional';
import {InvalidValueOfJwt} from './InvalidValueOfJwt';

export interface IAuthorizer<T> {
  Parse(crypted: string): [Optional<T>, Optional<InvalidValueOfJwt>];
  Decode(crypted: T): string;
}
