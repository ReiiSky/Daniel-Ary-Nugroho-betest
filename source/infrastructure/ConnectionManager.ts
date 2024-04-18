import {NotImplementedError} from './error/NotImplementedError';
import {Connection} from './connection/Connection';

export class ConnectionManager {
  private connectionMap: Map<string, Connection>;

  public constructor(private readonly connections: Connection[]) {
    this.connectionMap = new Map();
    this.connections.forEach(conn =>
      this.connectionMap.set(conn.techname, conn)
    );
  }

  public async get(techname: string): Promise<Connection> {
    const conn = this.connectionMap.get(techname);

    if (!conn) {
      throw new NotImplementedError(`${techname} connection`);
    }

    // only connect once.
    // TODO: apply transaction, such as conn.begin().
    // and commit on no any error occur.
    await conn.connect();

    return conn;
  }

  public async closeAll() {
    const promises = this.connections.map(conn => conn.close());
    await Promise.all(promises);
  }
}
