import {Credential} from '../../source/domain/Credential';
import {RegisterUser, UpdateUserCredentials} from '../../source/domain/event';
import {InformationNumber} from '../../source/domain/object/InfomationNumber';
import {Username} from '../../source/domain/object/Username';
import {EmptyValue} from '../../source/package/EmptyValue';
import {Optional} from '../../source/package/monad/Optional';
import {DummyUser} from './entity/DummyUser';

test('Credential should be able to register one user.', () => {
  for (const {userPayload, throwable} of DummyUser.invariantConstructTest) {
    if (throwable) continue;

    const credAggr = Credential.newEmpty();
    credAggr.register(userPayload);

    expect(credAggr.isRegistered(userPayload.email)).toBe(true);
    expect(credAggr.events[0] instanceof RegisterUser).toBe(true);
  }
});

test('Credential should be able to update user information.', () => {
  for (const {userPayload, throwable} of DummyUser.invariantConstructTest) {
    if (throwable) continue;

    const newUsername = 'first-user-v2';
    const newAccountNumber = '90321489721';

    const credAggr = Credential.new(EmptyValue.DefaultString, userPayload);
    credAggr.updateUsername(newUsername);
    credAggr.updateAccountNumber(Optional.some(newAccountNumber));

    expect(credAggr.events.length).toBe(2);
    expect(credAggr.events[0] instanceof UpdateUserCredentials).toBe(true);
    expect(
      (credAggr.events[0] as UpdateUserCredentials).username.unwrap(
        Username.new(EmptyValue.DefaultString)
      ).value
    ).toBe(newUsername);

    expect(credAggr.events[1] instanceof UpdateUserCredentials).toBe(true);
    expect(
      (credAggr.events[1] as UpdateUserCredentials).accountNumber.unwrap(
        InformationNumber.new(EmptyValue.DefaultString)
      ).number
    ).toBe(newAccountNumber);
  }
});

test('Credential should be able to delete user account number.', () => {
  for (const {userPayload, throwable} of DummyUser.invariantConstructTest) {
    if (throwable) continue;

    const credAggr = Credential.new(EmptyValue.DefaultString, userPayload);
    credAggr.updateAccountNumber(Optional.none());

    expect(credAggr.events.length).toBe(1);
    expect(credAggr.events[0] instanceof UpdateUserCredentials).toBe(true);
    expect(
      (credAggr.events[0] as UpdateUserCredentials).accountNumber.unwrap(
        InformationNumber.new(EmptyValue.DefaultString)
      ).number
    ).toBe(EmptyValue.DefaultString);
  }
});

test.todo('Credential should be able to delete valid user.');
test.todo(
  'Credential will validate invariant on instantiating, when entity count in aggregate more than one including root.'
);
