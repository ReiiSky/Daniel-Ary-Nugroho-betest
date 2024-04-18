import {ObjectId} from 'mongodb';
import {RegisterUser} from '../../domain/event';
import {ConnectionManager} from '../ConnectionManager';
import {CommandResponse} from './CommandResponse';
import {MongoBase} from './MongoBase';

export class MongoRegisterCredential extends MongoBase.Mongo {
  async execute(
    manager: ConnectionManager,
    event: RegisterUser
  ): Promise<CommandResponse.All> {
    const connection = await this.getConn(manager);
    const session = connection.session;

    const newObjectID = new ObjectId();
    const opResult = await connection.db
      .collection(MongoBase.Cols.USERS)
      .insertOne(
        {
          _id: newObjectID,
          email: event.userPayload.email,
          username: event.userPayload.username,
          number: {
            identity: event.userPayload.number.identity,
            account: event.userPayload.number.account.forceUnwrap(),
          },
          created_at: event.createdAt.unwrap(new Date()),
        },
        {session}
      );

    return this.extractInsertOneResponse(opResult);
  }

  get eventname() {
    return RegisterUser.name;
  }
}
