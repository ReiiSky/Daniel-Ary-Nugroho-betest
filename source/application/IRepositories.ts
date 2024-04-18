import {Aggregate} from '../domain/context/Aggregate';
import {IQueryRepository} from './IQueryRepository';

export interface IRepositories {
  Credential: IQueryRepository<Aggregate>;
}
