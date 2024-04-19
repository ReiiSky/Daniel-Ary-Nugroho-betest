import {Connection} from './Connection';
import {RedisConfig} from './RedisConfig';
import {Technames} from './Technames';
import {Redis} from '@upstash/redis';
import 'isomorphic-fetch';

export class RedisConnection extends Connection {
  public readonly redis: Redis;
  public readonly ttl: number;

  constructor(config: RedisConfig) {
    super(Technames.REDIS);

    this.redis = new Redis({
      url: config.url,
      token: config.password,
    });

    this.ttl = config.ttl;
  }

  async connect(): Promise<void> {}
  async abort(): Promise<void> {}
  async commit(): Promise<void> {}
  async close(): Promise<void> {}
}
