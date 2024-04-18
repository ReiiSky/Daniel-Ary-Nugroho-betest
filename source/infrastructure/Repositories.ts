import {IQueryRepository} from '../application/IQueryRepository';
import {Aggregate} from '../domain/context/Aggregate';
import {Scope} from '../domain/Scope';
import {ConnectionManager} from './ConnectionManager';
import {ISpecificationImpl} from './ISpecificationImpl';
import {NotImplementedError} from './error/NotImplementedError';
import {QueryRepository} from './QueryRepository';
import {RepositoriesRegistrator} from './RepositoriesRegistrator';

export class Repositories {
  // [scope: query repositories]
  private queryRepositoryMap: Map<string, QueryRepository<Aggregate>> =
    new Map();

  constructor(
    private readonly connectionManager: ConnectionManager,
    registrator: RepositoriesRegistrator
  ) {
    registrator.specifications.forEach((impls, scope) =>
      this.addQueryRepositoryMap(scope, impls)
    );
  }

  public addQueryRepositoryMap(scope: string, impls: ISpecificationImpl[]) {
    const queryRepository = new QueryRepository(
      this.connectionManager,
      scope,
      impls
    );
    this.queryRepositoryMap.set(scope, queryRepository);
  }

  private mustGet(scope: Scope): IQueryRepository<Aggregate> {
    const repository = this.queryRepositoryMap.get(scope);

    if (!repository) {
      throw new NotImplementedError(`${scope} query repository`);
    }

    return repository;
  }

  public get Credential(): IQueryRepository<Aggregate> {
    return this.mustGet(Scope.Credential);
  }
}
