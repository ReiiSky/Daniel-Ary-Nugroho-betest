import {User} from '../../../source/domain/entity/User';
import {Optional} from '../../../source/package/monad/Optional';
import {DummyUser} from '../../../source/domain/entity/dummy/DummyUser';

test('User entity check invariant on construct', () => {
  for (const {userPayload, throwable} of DummyUser.invariantConstructTest) {
    const run = () =>
      User.new(userPayload.identifier, Optional.none(), userPayload);

    if (throwable) {
      expect(run).toThrow();
      continue;
    }

    expect(run).not.toThrow();
  }
});
