import {Optional} from '../../package/monad/Optional';

export type MongoConfig = {
  url: string;
  dbname: Optional<string>;
  password: string;
};
