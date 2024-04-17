import {Identifier} from '../object/Identifier';

export abstract class Entity<T> {
  constructor(private readonly identifier: Identifier<T>) {}

  public get ID(): Identifier<T> {
    return this.identifier.clone();
  }
}
