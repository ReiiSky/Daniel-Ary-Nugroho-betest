import {Aggregate} from '../domain/context/Aggregate';
import {ISpecification} from '../domain/context/ISpecification';
import {ConnectionManager} from './ConnectionManager';

export interface ISpecificationImpl extends ISpecification {
  query(
    manager: ConnectionManager,
    specification: ISpecification
  ): Promise<Aggregate[]>;
}
