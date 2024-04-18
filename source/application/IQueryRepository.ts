import {Aggregate} from '../domain/context/Aggregate';
import {ISpecification} from '../domain/context/ISpecification';
import {Optional} from '../package/monad/Optional';

export interface IQueryRepository<T extends Aggregate> {
  getOne(spec: ISpecification): Promise<Optional<T>>;
  get(spec: ISpecification): Promise<T[]>;
}
