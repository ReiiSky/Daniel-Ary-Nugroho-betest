import {RepositoriesRegistrator} from './RepositoriesRegistrator';
import {Context} from './Context';
import {ConnectionManagerBuilder} from './ConnectionManagerBuilder';

export class Kernel {
  constructor(
    public readonly repositoryRegistrator: RepositoriesRegistrator,
    public connectionBuilder: ConnectionManagerBuilder
  ) {}

  public newContext() {
    const connectionManager = this.connectionBuilder.build();
    return new Context(connectionManager, this.repositoryRegistrator);
  }
}
