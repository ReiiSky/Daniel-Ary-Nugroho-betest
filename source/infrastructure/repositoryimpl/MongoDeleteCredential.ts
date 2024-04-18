import {ObjectId} from 'mongodb';
import {DeleteUserCredential} from '../../domain/event';
import {ConnectionManager} from '../ConnectionManager';
import {CommandResponse} from './CommandResponse';
import {MongoBase} from './MongoBase';

export class MongoDeleteCredential extends MongoBase.Mongo {
  async execute(
    manager: ConnectionManager,
    event: DeleteUserCredential
  ): Promise<CommandResponse.All> {
    const connection = await this.getConn(manager);
    const session = connection.session;

    const filter = {_id: new ObjectId(event.identifier.id)};

    const opResult = await connection.db
      .collection(MongoBase.Cols.USERS)
      .deleteOne(filter, {session});

    return this.extractDeleteResponse(opResult);
  }

  get eventname() {
    return DeleteUserCredential.name;
  }
}
