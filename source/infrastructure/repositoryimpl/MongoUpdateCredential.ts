import {ObjectId} from 'mongodb';
import {UpdateUserCredentials} from '../../domain/event';
import {ConnectionManager} from '../ConnectionManager';
import {CommandResponse} from './CommandResponse';
import {MongoBase} from './MongoBase';

export class MongoUpdateCredential extends MongoBase.Mongo {
  async execute(
    manager: ConnectionManager,
    event: UpdateUserCredentials
  ): Promise<CommandResponse.All> {
    const connection = await this.getConn(manager);
    const session = connection.session;

    const filter = {_id: new ObjectId(event.identifier.id)};
    const newField: {username?: string; 'number.account'?: string} = {};

    event.username.use(name => (newField['username'] = name.value));
    event.accountNumber.use(
      account => (newField['number.account'] = account.number)
    );

    const opResult = await connection.db
      .collection(MongoBase.Cols.USERS)
      .updateOne(filter, {$set: newField}, {session});

    return this.extractUpdateResponse(opResult);
  }

  get eventname() {
    return UpdateUserCredentials.name;
  }
}
