import {ConnectionManager} from '../ConnectionManager';
import {RedisConnection} from '../connection/RedisConnection';
import {Technames} from '../connection/Technames';

export namespace RedisBase {
  export abstract class Redis {
    public static readonly collections = {};

    public async getConn(manager: ConnectionManager) {
      const conn = await manager.get(Technames.REDIS);

      return conn as RedisConnection;
    }
  }
}
