import * as mongo from 'mongodb';
import {Credential} from '../../domain/Credential';
import {GetByIDStr} from '../../domain/specification';
import {ConnectionManager} from '../ConnectionManager';
import {MongoBase} from './MongoBase';
import {UserPayload} from '../../domain/entity/UserPayload';
import {Optional} from '../../package/monad/Optional';

export class MongoGetCredentialByID extends MongoBase.Mongo {
  async query(
    manager: ConnectionManager,
    spec: GetByIDStr
  ): Promise<Credential[]> {
    const connection = await super.getConn(manager);
    const col = connection.db.collection(MongoBase.Cols.USERS);

    const doc = await col.findOne<MongoBase.CredentialDoc>({
      _id: new mongo.ObjectId(spec.id),
    });

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
    return GetByIDStr.name;
  }
}
