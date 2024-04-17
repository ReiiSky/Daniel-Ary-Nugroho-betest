import {Optional} from '../../package/monad/Optional';

export type UserPayload = {
  username: string;
  email: string;
  number: {
    identity: string;
    account: Optional<string>;
  };
};
