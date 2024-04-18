import * as jwt from 'jsonwebtoken';
import {AuthPayload} from '../../application/AuthPayload';
import {Optional} from '../../package/monad/Optional';
import {InvalidValueOfJwt} from '../InvalidValueOfJwt';

export class Jwt {
  constructor(private readonly key: string) {}

  Parse(crypted: string): [Optional<AuthPayload>, Optional<InvalidValueOfJwt>] {
    try {
      const decoded = jwt.verify(crypted, this.key, {complete: true});

      // TODO: apply validate here please.
      const payload = JSON.parse(decoded.payload.toString());
      return [Optional.some(payload), Optional.none()];
    } catch (error) {
      return [Optional.none(), Optional.some(new InvalidValueOfJwt(crypted))];
    }
  }

  Decode(payload: AuthPayload): string {
    // TODO: please use expired in.
    return jwt.sign(payload, this.key);
  }
}
