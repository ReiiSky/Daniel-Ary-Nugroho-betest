import {RedisConnection} from './RedisConnection';
import {RedisConfig} from './RedisConfig';

export class RedisBuilder {
  constructor(private readonly config: RedisConfig) {}

  build(): RedisConnection {
    return new RedisConnection(this.config);
  }
}
