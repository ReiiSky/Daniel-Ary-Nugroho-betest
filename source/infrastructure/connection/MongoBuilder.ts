import {MongoConfig} from './MongoConfig';
import {MongoConnection} from './MongoConnection';

export class MongoBuilder {
  constructor(private readonly config: MongoConfig) {}

  build(): MongoConnection {
    return new MongoConnection(this.config);
  }
}
