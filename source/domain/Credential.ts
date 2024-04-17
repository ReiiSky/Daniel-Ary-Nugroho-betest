import {EmptyValue} from '../package/EmptyValue';
import {Optional} from '../package/monad/Optional';
import {Aggregate} from './context/Aggregate';
import {User} from './entity/User';
import {UserPayload} from './entity/UserPayload';
import * as events from './event';

export class Credential extends Aggregate {
  private root: User;
  private constructor(
    id: string,
    rootPayload: UserPayload,
    createdAt = Optional.none<Date>()
  ) {
    super();

    this.root = User.new(id, createdAt, rootPayload);
  }

  public static new(
    id: string,
    userPayload: UserPayload,
    createdAt = Optional.none<Date>()
  ) {
    return new Credential(id, userPayload, createdAt);
  }

  public static newEmpty(): Credential {
    return new Credential(
      EmptyValue.DefaultString,
      {
        username: EmptyValue.DefaultString,
        email: EmptyValue.DefaultEmail,
        number: {
          account: Optional.none(),
          identity: EmptyValue.DefaultString,
        },
      },
      Optional.some(new Date())
    );
  }

  public register(userPayload: UserPayload) {
    const createdAt = Optional.auto(new Date());

    this.root = User.new(EmptyValue.DefaultString, createdAt, userPayload);
    this.addEvent(new events.RegisterUser(userPayload, createdAt));
  }

  public isRegistered(otherEmail: string) {
    return this.root.equalByEmail(otherEmail);
  }

  public updateUsername(newUsername: string) {
    this.root.putUsername(newUsername);
    this.addEvent(
      new events.UpdateUserCredentials(
        this.root.ID,
        Optional.some(this.root.username)
      )
    );
  }

  public updateAccountNumber(newAccountNumber: Optional<string>) {
    this.root.putAccountNumber(newAccountNumber);
    this.addEvent(
      new events.UpdateUserCredentials(
        this.root.ID,
        Optional.none(),
        this.root.accountNumber
      )
    );
  }

  public delete() {
    const containDeleteEvent =
      this.events.filter(event => event instanceof events.DeleteUserCredential)
        .length > 0;

    if (containDeleteEvent) {
      return;
    }

    const deletable = this.root.ID.id !== EmptyValue.DefaultString;

    if (!deletable) {
      return;
    }

    this.addEvent(new events.DeleteUserCredential(this.root.ID));
  }
}
