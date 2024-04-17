import {Optional} from '../../package/monad/Optional';
import {UserPayload} from '../entity/UserPayload';

export class RegisterUser {
  public constructor(
    public readonly userPayload: UserPayload,
    public readonly createdAt: Optional<Date>
  ) {}

  public get eventname() {
    return RegisterUser.name;
  }
}
