import {ConnectionManager} from '../ConnectionManager';
import {InMemoryConnection} from '../connection/InMemoryConnection';
import {Technames} from '../connection/Technames';

export abstract class InMemory {
  // TODO: Add abstraction on return InMemoryConnection,
  // to prevent uneeded function call in impl,
  // such as connect() and close()
  public async getConn(manager: ConnectionManager) {
    const conn = await manager.get(Technames.INMEMORY);

    return conn as InMemoryConnection;
  }
}
