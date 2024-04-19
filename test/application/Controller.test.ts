import * as mongo from 'mongodb';
import {DummyUser} from '../../source/domain/entity/dummy/DummyUser';
import {ConnectionManagerBuilder} from '../../source/infrastructure/ConnectionManagerBuilder';
import {MongoBuilder} from '../../source/infrastructure/connection/MongoBuilder';
import {MongoConnection} from '../../source/infrastructure/connection/MongoConnection';
import {Technames} from '../../source/infrastructure/connection/Technames';
import {Local} from '../../source/infrastructure/environment/Local';
import {EmptyValue} from '../../source/package/EmptyValue';
import {MongoBase} from '../../source/infrastructure/repositoryimpl/MongoBase';
import {CredentialController} from '../../source/application/controller/CredentialController';
import {Kernel} from '../../source/infrastructure/Kernel';
import {MongoGetCredentialByID} from '../../source/infrastructure/repositoryimpl/MongoGetCredentialByID';
import {RepositoriesRegistrator} from '../../source/infrastructure/RepositoriesRegistrator';
import {Scope} from '../../source/domain/Scope';
import {MongoGetCredentialByEmail} from '../../source/infrastructure/repositoryimpl/MongoGetCredentialByEmail';
import {MongoGetCredentialByNumber} from '../../source/infrastructure/repositoryimpl/MongoGetCredentialByNumber';
import {MongoRegisterCredential} from '../../source/infrastructure/repositoryimpl/MongoRegisterCredential';
import {RequestForm} from '../../source/application/RequestForm';
import {MongoUpdateCredential} from '../../source/infrastructure/repositoryimpl/MongoUpdateCredential';
import {MongoDeleteCredential} from '../../source/infrastructure/repositoryimpl/MongoDeleteCredential';

describe('Run controller credential', () => {
  const local = new Local('./config/.env');
  const mongoURL = local
    .getString('MONGO_URL')
    .unwrap(EmptyValue.DefaultString);

  const mongoDBName = local.getString('MONGO_DBNAME');
  const mongoPassword = local
    .getString('MONGO_PASSWORD')
    .unwrap(EmptyValue.DefaultString);

  if (mongoURL === EmptyValue.DefaultString || mongoURL.length <= 8) {
    return;
  }

  const connectionManagerBuilder = new ConnectionManagerBuilder();
  connectionManagerBuilder.add(
    new MongoBuilder({
      url: mongoURL,
      dbname: mongoDBName,
      password: mongoPassword,
    })
  );

  beforeAll(async () => {
    const connectionManager = connectionManagerBuilder.build();
    const mongoConnection = (await connectionManager.get(
      Technames.MONGO
    )) as MongoConnection;

    const db = mongoConnection.db;
    try {
      const insertPromises = DummyUser.mongoSpecTest.map(
        ({identifier, number, ...doc}) =>
          db
            .collection(MongoBase.Cols.USERS)
            // TODO: consider using upsert operation.
            .insertOne({
              _id: new mongo.ObjectId(identifier),
              number: {
                identity: number.identity,
                account: number.account.forceUnwrap(),
              },
              ...doc,
              created_at: new Date(),
            })
      );

      await Promise.allSettled(insertPromises);
      await mongoConnection.db
        .collection(MongoBase.Cols.USERS)
        .createIndex({email: 1}, {unique: true});

      await mongoConnection.db
        .collection(MongoBase.Cols.USERS)
        .createIndex({'number.identity': 1}, {unique: true});

      await mongoConnection.db
        .collection(MongoBase.Cols.USERS)
        .createIndex({'number.account': 1}, {});
    } finally {
      await mongoConnection.close();
    }
  });

  const repositoryRegistrator = new RepositoriesRegistrator()
    .scope(Scope.Credential)
    .addSpecification(new MongoGetCredentialByID())
    .addSpecification(new MongoGetCredentialByEmail())
    .addSpecification(new MongoGetCredentialByNumber())
    .addEvent(new MongoRegisterCredential())
    .addEvent(new MongoUpdateCredential())
    .addEvent(new MongoDeleteCredential());

  const kernel = new Kernel(repositoryRegistrator, connectionManagerBuilder);
  const c = new CredentialController();

  it('should be able to find data by id.', async () => {
    const current = DummyUser.mongoSpecTest[0];
    const output = await c.getByID(kernel.newContext(), {
      Auth: {id: current.identifier},
      Query: {},
    });
    expect(output).not.toBeUndefined();
    expect(output?.email).toBe(current.email);
  });

  it('should be able to find data by email.', async () => {
    const current = DummyUser.mongoSpecTest[1];
    const output = await c.getByEmail(kernel.newContext(), {
      Auth: {id: current.identifier},
      Query: {
        email: current.email,
      },
    });

    expect(output).not.toBeUndefined();
    expect(output?.email).toBe(current.email);
  });

  it('should be able to find data by number.', async () => {
    const current = DummyUser.mongoSpecTest[1];
    const output = await c.getByNumber(kernel.newContext(), {
      Auth: {id: current.identifier},
      Query: {
        identity: current.number.identity,
      },
    });

    expect(output).not.toBeUndefined();
    expect(output?.number.identity).toBe(current.number.identity);
    expect(output?.number.account).toBe(current.number.account.forceUnwrap());
  });

  it('should be able to register data.', async () => {
    const current = DummyUser.mongoWriteTest[0];
    const request = {
      Query: {},
      Body: JSON.stringify({
        identifier: current.identifier,
        username: current.username,
        email: current.email,
        number: {
          identity: current.number.identity,
          account: current.number.account.forceUnwrap(),
        },
      }),
    };

    const success = await c.register(kernel.newContext(), request);
    expect(success).toBe(true);
  });

  it('should be able to update data username.', async () => {
    const current = DummyUser.mongoUpdateTest[0];
    const request: RequestForm = {
      Auth: {id: current.identifier},
      Query: {},
      Body: JSON.stringify({
        username: current.username.forceUnwrap(),
      }),
    };

    const success = await c.update(kernel.newContext(), request);
    expect(success).toBe(true);
  });

  it('should be able to delete credential.', async () => {
    const current = DummyUser.mongoDeleteTest[0];
    const request: RequestForm = {
      Auth: {id: current.identifier.unwrap('')},
      Query: {},
    };

    const success = await c.delete(kernel.newContext(), request);
    expect(success).toBe(true);
  });
});
