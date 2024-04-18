import {Aggregate} from '../domain/context/Aggregate';
import {CommandResponse} from '../infrastructure/repositoryimpl/CommandResponse';
import {IQueryRepository} from './IQueryRepository';

export interface IRepositories {
  Credential: IQueryRepository<Aggregate>;
  save(aggregate: Aggregate): Promise<CommandResponse.All[]>;
}
