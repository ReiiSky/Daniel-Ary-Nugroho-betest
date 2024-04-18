import {InMemoryConnection} from './InMemoryConnection';

export class InMemoryBuilder {
  constructor() {}

  build(): InMemoryConnection {
    return new InMemoryConnection();
  }
}
