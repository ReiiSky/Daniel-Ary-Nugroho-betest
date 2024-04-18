import {IRepositories} from '../application/IRepositories';
import {ConnectionManager} from './ConnectionManager';
import {Repositories} from './Repositories';
import {RepositoriesRegistrator} from './RepositoriesRegistrator';

export class Context {
  constructor(
    private readonly connectionManager: ConnectionManager,
    private repositoriesRegistrator: RepositoriesRegistrator
  ) {}

  public repositories(): IRepositories {
    return new Repositories(
      this.connectionManager,
      this.repositoriesRegistrator
    );
  }

  async close() {
    await this.connectionManager.closeAll();
  }
}
