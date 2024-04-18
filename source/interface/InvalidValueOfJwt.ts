import {RecoverableError} from '../package/RecoverableError';
import {Optional} from '../package/monad/Optional';

export class InvalidValueOfJwt extends RecoverableError {
  constructor(jwtText: string) {
    super(`Jwt text is not valid: ${jwtText}.`, Optional.none());
  }
}
