import {CredentialOutput} from '../../application/dto/CredentialOutput';
import {Credential} from '../../domain/Credential';
import {GetByIDStr} from '../../domain/specification';
import {Optional} from '../../package/monad/Optional';
import {ConnectionManager} from '../ConnectionManager';
import {ISpecificationImpl} from '../ISpecificationImpl';
import {UserModel} from '../model/UserModel';
import {RedisBase} from './RedisBase';

export class DecoratorRedisGetCredential extends RedisBase.Redis {
  constructor(private readonly baseImpl: ISpecificationImpl) {
    super();
  }

  async query(
    manager: ConnectionManager,
    spec: GetByIDStr
  ): Promise<Credential[]> {
    const conn = await this.getConn(manager);
    const value = await conn.redis.get<UserModel>(spec.id);

    if (value) {
      const credential = Credential.new(
        spec.id,
        {
          email: value.email,
          username: value.username,
          number: {
            identity: value.number.identity,
            account: Optional.auto(value.number.account),
          },
        },
        Optional.none()
      );

      return [credential];
    }

    const baseAggregates = await this.baseImpl.query(manager, spec);

    if (baseAggregates.length > 0) {
      const first = baseAggregates[0] as Credential;
      const output = first.out(CredentialOutput.build);

      await conn.redis.setex(spec.id, conn.ttl, JSON.stringify(output));
    }

    return baseAggregates as Credential[];
  }

  get specname(): string {
    return GetByIDStr.name;
  }
}
