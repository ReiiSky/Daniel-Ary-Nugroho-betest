import {NonRecoverableError} from '../../package/NonRecoverableError';

export class NotValidScopeError extends NonRecoverableError {
  constructor() {
    super('specification scope is not valid or empty.');
  }
}
