import {EmptyValue} from '../../../package/EmptyValue';
import {Optional} from '../../../package/monad/Optional';

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

  public static mongoSpecTest = [
    {
      identifier: '6620b6e8d2e041357855e051',
      username: 'first-user',
      email: 'first.user123@gmail.com',
      number: {
        identity: '3175062002991011',
        account: Optional.some('92148000200'),
      },
    },
    {
      identifier: '6620b6e8d2e041357855e05f',
      username: 'second-user',
      email: 'second.user456@gmail.com',
      number: {
        identity: '3175062002991022',
        account: Optional.some(EmptyValue.DefaultString),
      },
    },
    {
      identifier: '6620b6ae60d8f2a1b5836048',
      username: 'third-user',
      email: 'third.user456@gmail.com',
      number: {
        identity: '3175062002991023',
        account: Optional.auto(undefined),
      },
    },
  ];

  public static mongoWriteTest = [
    {
      identifier: '662131121fea75ea9f8c0f3c',
      username: 'fourth-user',
      email: 'fourth.user768@gmail.com',
      number: {
        identity: '3175062002978211',
        account: Optional.some('92148000887'),
      },
    },
    {
      identifier: '662131191fea75ea9f8c0f3d',
      username: 'fifth-user',
      email: 'fifth.user@gmail.com',
      number: {
        identity: '3175068952978211',
        account: Optional.some('92148072887'),
      },
    },
  ];
}
