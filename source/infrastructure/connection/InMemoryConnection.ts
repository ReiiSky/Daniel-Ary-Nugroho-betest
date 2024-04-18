import {DummyUser} from '../../../test/domain/entity/DummyUser';
import {Connection} from './Connection';
import {Technames} from './Technames';

export class InMemoryConnection extends Connection {
  public readonly rows = DummyUser.invariantConstructTest;

  constructor() {
    super(Technames.INMEMORY);
  }

  async connect(): Promise<void> {}
  async close(): Promise<void> {}
}
