import {NonRecoverableError} from '../../package/NonRecoverableError';

export class NotImplementedError extends NonRecoverableError {
  constructor(notImplementedFeatureName: string) {
    super(`${notImplementedFeatureName} is not implemented`);
  }
}
