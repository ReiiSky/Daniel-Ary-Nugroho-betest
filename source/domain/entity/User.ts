import {Optional} from '../../package/monad/Optional';
import {Email} from '../object/Email';
import {Identifier} from '../object/Identifier';
import {InformationNumber} from '../object/InfomationNumber';
import {Entity} from './Entity';
import {UserPayload} from './UserPayload';

export class User extends Entity<string> {
  private constructor(
    id: Identifier<string>,
    private _username: string,
    private _email: Email,
    private _identityNumber: InformationNumber<string>,
    private _accountNumber: Optional<InformationNumber<string>>
  ) {
    super(id);
  }

  public static new(
    id: string,
    createdAt: Optional<Date>,
    payload: UserPayload
  ) {
    const identifier = Identifier.new(id, createdAt);
    const email = Email.new(payload.email);
    const identityNumber = InformationNumber.new(payload.number.identity);
    const accountNumber = payload.number.account
      .use(num => Optional.some(InformationNumber.new(num)))
      .unwrap(Optional.none());

    return new User(
      identifier,
      payload.username,
      email,
      identityNumber,
      accountNumber
    );
  }

  public equalByEmail(other: string) {
    return this._email.value === other;
  }
}
