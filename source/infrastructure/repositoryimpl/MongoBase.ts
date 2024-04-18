import {WithId} from 'mongodb';
import {ConnectionManager} from '../ConnectionManager';
import {MongoConnection} from '../connection/MongoConnection';
import {Technames} from '../connection/Technames';

export namespace MongoBase {
  export type CredentialDoc = WithId<{
    username: string;
    email: string;
    number: {
      identity: string;
      account?: string;
    };
  }> & {created_at: Date};

  export enum Cols {
    USERS = 'users',
  }

  export abstract class Mongo {
    public static readonly collections = {};

    public async getConn(manager: ConnectionManager) {
      const conn = await manager.get(Technames.MONGO);

      return conn as MongoConnection;
    }
  }
}
