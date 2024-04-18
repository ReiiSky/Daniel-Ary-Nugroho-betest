import {
  DeleteResult,
  InsertManyResult,
  InsertOneResult,
  UpdateResult,
  WithId,
} from 'mongodb';
import {ConnectionManager} from '../ConnectionManager';
import {MongoConnection} from '../connection/MongoConnection';
import {Technames} from '../connection/Technames';
import {CommandResponse} from './CommandResponse';
import {QueryResponse} from './QueryResponse';

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

    protected extractInsertOneResponse(
      result: InsertOneResult
    ): CommandResponse.All {
      return {
        deletedCount: 0,
        modifiedCount: 0,
        insertedIDNumber: [],
        insertedIDText: [result.insertedId.toString()],
      };
    }

    protected extractInsertManyResponse(
      result: InsertManyResult
    ): CommandResponse.All {
      const insertedIdx = Object.keys(result.insertedIds);
      const reducedValues: Array<string> = Array(insertedIdx.length);

      for (const idx of insertedIdx) {
        const idxNum = Number(idx);
        reducedValues[idxNum] = result.insertedIds[idxNum].toString();
      }

      return {
        deletedCount: 0,
        modifiedCount: 0,
        insertedIDNumber: [],
        insertedIDText: reducedValues,
      };
    }

    protected extractUpdateResponse(
      result: UpdateResult
    ): QueryResponse.Match & CommandResponse.All {
      return {
        matchedCount: 0,
        deletedCount: 0,
        modifiedCount: result.modifiedCount,
        insertedIDNumber: [],
        insertedIDText: [],
      };
    }

    protected extractDeleteResponse(result: DeleteResult): CommandResponse.All {
      return {
        deletedCount: result.deletedCount,
        modifiedCount: 0,
        insertedIDNumber: [],
        insertedIDText: [],
      };
    }
  }
}
