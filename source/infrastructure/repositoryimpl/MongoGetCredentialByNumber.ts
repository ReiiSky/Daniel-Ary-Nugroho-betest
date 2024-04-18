import {Credential} from '../../domain/Credential';
import {GetByNumber} from '../../domain/specification';
import {ConnectionManager} from '../ConnectionManager';
import {MongoBase} from './MongoBase';
import {UserPayload} from '../../domain/entity/UserPayload';
import {Optional} from '../../package/monad/Optional';

export class MongoGetCredentialByNumber extends MongoBase.Mongo {
  async query(
    manager: ConnectionManager,
    spec: GetByNumber
  ): Promise<Credential[]> {
    const connection = await super.getConn(manager);
    const col = connection.db.collection(MongoBase.Cols.USERS);

    const filter: {'number.account'?: string; 'number.identity'?: string} = {};

    spec.account.use(num => (filter['number.account'] = num.number));
    spec.identity.use(num => (filter['number.identity'] = num.number));

    const doc = await col.findOne<MongoBase.CredentialDoc>(filter);

    if (!doc) return [];

    const userPayload: UserPayload = {
      email: doc.email,
      username: doc.username,
      number: {
        identity: doc.number.identity,
        account: Optional.auto(doc.number.account),
      },
    };

    const credential = Credential.new(
      doc._id.toString(),
      userPayload,
      Optional.some(doc.created_at)
    );

    return [credential];
  }

  get specname(): string {
    return GetByNumber.name;
  }
}
