import {EmptyValue} from '../../package/EmptyValue';
import {Optional} from '../../package/monad/Optional';
import {Email} from '../object/Email';
import {Identifier} from '../object/Identifier';
import {InformationNumber} from '../object/InfomationNumber';
import {Username} from '../object/Username';
import {Entity} from './Entity';
import {UserPayload} from './UserPayload';

export class User extends Entity<string> {
  // it seems, only account number and username field that can be updated.
  // other field such as identityNumber (NIK) or email can't.
  private constructor(
    id: Identifier<string>,
    private _username: Username,
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
    const username = Username.new(payload.username);
    const email = Email.new(payload.email);
    const identityNumber = InformationNumber.new(payload.number.identity);
    const accountNumber = payload.number.account
      .use(num => Optional.some(InformationNumber.new(num)))
      .unwrap(Optional.none());

    return new User(identifier, username, email, identityNumber, accountNumber);
  }

  public equalByEmail(other: string) {
    return this._email.value === other;
  }

  public get username() {
    return this._username.clone();
  }

  public putUsername(newUsername: string) {
    this._username = this._username.change(newUsername);
  }

  public get accountNumber() {
    const currentAccountNumber = this._accountNumber.unwrap(
      InformationNumber.new(EmptyValue.DefaultString)
    );

    if (currentAccountNumber.isEmpty()) {
      return Optional.none<InformationNumber<string>>();
    }

    return Optional.some(currentAccountNumber.clone());
  }

  public putAccountNumber(newAccountNumber: Optional<string>) {
    this._accountNumber = newAccountNumber
      .use(newNumber => Optional.some(InformationNumber.new(newNumber)))
      .unwrap(Optional.none());
  }
}
