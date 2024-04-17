import {NonRecoverableError} from '../../package/NonRecoverableError';

export class NotFoundValueError extends NonRecoverableError {
  constructor(key: string) {
    super(`retrieve '${key}' env value not found error.`);
  }
}
