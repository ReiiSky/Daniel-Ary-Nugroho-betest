import {Credential} from '../../source/domain/Credential';
import {RegisterUser} from '../../source/domain/event';
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

test.todo(
  'Credential should be able to partially/fully update user information.'
);
test.todo('Credential should be able to delete valid user.');
test.todo(
  'Credential will validate invariant on instantiating, when entity count in aggregate more than one including root.'
);
