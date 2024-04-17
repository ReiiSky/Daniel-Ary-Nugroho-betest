import {Optional} from '../../../source/package/monad/Optional';

export abstract class DummyUser {
  public static invariantConstructTest = [
    {
      userPayload: {
        identifier: 'abc123421',
        username: 'first-user',
        email: 'first.user123@gmail.com',
        number: {
          identity: '3175062002991011',
          account: Optional.some('92148000200'),
        },
      },
      throwable: false,
    },
    {
      userPayload: {
        identifier: 'abc123421asda',
        username: 'second-user',
        email: 'second.user456mail.com',
        number: {
          identity: '317506200299012',
          account: Optional.none<string>(),
        },
      },
      throwable: true,
    },
  ];
}
