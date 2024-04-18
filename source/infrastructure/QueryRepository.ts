import {Aggregate} from '../domain/context/Aggregate';
import {ISpecification} from '../domain/context/ISpecification';
import {Optional} from '../package/monad/Optional';
import {ConnectionManager} from './ConnectionManager';
import {ISpecificationImpl} from './ISpecificationImpl';
import {NotImplementedError} from './error/NotImplementedError';

export class QueryRepository<T extends Aggregate> {
  private implMap: Map<string, ISpecificationImpl> = new Map();

  constructor(
    private readonly connectionManager: ConnectionManager,
    private readonly scope: string,
    impls: ISpecificationImpl[]
  ) {
    impls.forEach(impl => this.implMap.set(impl.specname, impl));
  }

  mustGetImpl(specName: string): ISpecificationImpl {
    const impl = this.implMap.get(specName);

    if (!impl) {
      throw new NotImplementedError(`${specName} in scope ${this.scope}`);
    }

    return impl;
  }

  public async getOne(spec: ISpecification): Promise<Optional<T>> {
    const results = await this.get(spec);

    if (results.length <= 0) {
      return Optional.none();
    }

    return Optional.some(results[0]);
  }

  public async get(spec: ISpecification): Promise<T[]> {
    const impl = this.mustGetImpl(spec.specname);
    const results = await impl.query(this.connectionManager, spec);

    if (results.length <= 0) {
      return [];
    }

    return results as T[];
  }
}
