import {Aggregate} from '../domain/context/Aggregate';
import {CommandResponse} from '../infrastructure/repositoryimpl/CommandResponse';
import {IQueryRepository} from './IQueryRepository';

export interface IRepositories {
  Credential: IQueryRepository<Aggregate>;
  // TODO: Create new class, to store event responses.
  // such as CommandResponse.Container.
  // Can be used for filtering response based on event name,
  // Eg: CommandResponse.Container.filter(eventname: string): CommandResponse.All[].
  save(aggregate: Aggregate): Promise<CommandResponse.All[]>;
}
