import {IEventImpl} from './IEventImpl';
import {ISpecificationImpl} from './ISpecificationImpl';
import {NotValidScopeError} from './error/NotValidScopeError';

export class RepositoriesRegistrator {
  private currentScope = '';

  // [scope: impls]
  private specificationImpls: Map<string, ISpecificationImpl[]> = new Map();

  // [specification name: impls]
  private eventImpls: IEventImpl[] = [];

  public get specifications() {
    return this.specificationImpls;
  }

  public get events() {
    return this.eventImpls;
  }

  public scope(toScope: string): RepositoriesRegistrator {
    this.currentScope = toScope;
    return this;
  }

  public addSpecification(impl: ISpecificationImpl): RepositoriesRegistrator {
    if (this.currentScope.length <= 0) {
      throw new NotValidScopeError();
    }

    const currentScopeImpls =
      this.specificationImpls.get(this.currentScope) || [];

    currentScopeImpls.push(impl);
    this.specificationImpls.set(this.currentScope, currentScopeImpls);

    return this;
  }

  public addEvent(event: IEventImpl): RepositoriesRegistrator {
    this.eventImpls.push(event);
    return this;
  }
}
