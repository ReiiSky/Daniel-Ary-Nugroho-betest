import {IQueryRepository} from '../application/IQueryRepository';
import {Aggregate} from '../domain/context/Aggregate';
import {Scope} from '../domain/Scope';
import {ConnectionManager} from './ConnectionManager';
import {ISpecificationImpl} from './ISpecificationImpl';
import {NotImplementedError} from './error/NotImplementedError';
import {QueryRepository} from './QueryRepository';
import {RepositoriesRegistrator} from './RepositoriesRegistrator';
import {IEventImpl} from './IEventImpl';
import {CommandResponse} from './repositoryimpl/CommandResponse';

export class Repositories {
  // [scope: query repositories]
  private queryRepositoryMap: Map<string, QueryRepository<Aggregate>> =
    new Map();

  private commandRepositoryMap: Map<string, IEventImpl> = new Map();

  constructor(
    private readonly connectionManager: ConnectionManager,
    registrator: RepositoriesRegistrator
  ) {
    registrator.specifications.forEach((impls, scope) =>
      this.addQueryRepositoryMap(scope, impls)
    );

    registrator.events.forEach(event =>
      this.commandRepositoryMap.set(event.eventname, event)
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

  public async save(aggregate: Aggregate): Promise<CommandResponse.All[]> {
    const events = aggregate.events;
    const results = [];

    try {
      for (const event of events) {
        const eventImpl = this.commandRepositoryMap.get(event.eventname);

        if (!eventImpl) {
          await this.connectionManager.abortAll();
          throw new NotImplementedError(`${event.eventname} domain event`);
        }

        const result = await eventImpl.execute(this.connectionManager, event);
        results.push(result);
      }

      await this.connectionManager.commitAll();
    } catch (error) {
      await this.connectionManager.abortAll();

      if (error instanceof NotImplementedError) {
        throw error;
      }
    }

    return results;
  }

  public get Credential(): IQueryRepository<Aggregate> {
    return this.mustGet(Scope.Credential);
  }
}
