import {NonRecoverableError} from '../../../package/NonRecoverableError';

export class ConstructError<T> extends NonRecoverableError {
  constructor(domainName: string, value: T) {
    super(`Error create ${domainName} object, with value '${value}'.`);
  }
}
