import * as mongo from 'mongodb';
import {Credential} from '../../source/domain/Credential';
import {Scope} from '../../source/domain/Scope';
import {DummyUser} from '../../source/domain/entity/dummy/DummyUser';
import * as specs from '../../source/domain/specification';
import {ConnectionManagerBuilder} from '../../source/infrastructure/ConnectionManagerBuilder';
import {Kernel} from '../../source/infrastructure/Kernel';
import {RepositoriesRegistrator} from '../../source/infrastructure/RepositoriesRegistrator';
import {InMemoryBuilder} from '../../source/infrastructure/connection/InMemoryBuilder';
import {MongoBuilder} from '../../source/infrastructure/connection/MongoBuilder';
import {MongoConnection} from '../../source/infrastructure/connection/MongoConnection';
import {Technames} from '../../source/infrastructure/connection/Technames';
import {Local} from '../../source/infrastructure/environment/Local';
import {InMemoryGetCredentialByEmail} from '../../source/infrastructure/repositoryimpl/InMemoryGetCredentialByEmail';
import {EmptyValue} from '../../source/package/EmptyValue';
import {MongoBase} from '../../source/infrastructure/repositoryimpl/MongoBase';
import {MongoGetCredentialByID} from '../../source/infrastructure/repositoryimpl/MongoGetCredentialByID';

describe('Use in-memory store in kernel repository', () => {
  const connectionManagerBuilder = new ConnectionManagerBuilder();
  connectionManagerBuilder.add(new InMemoryBuilder());

  const repositoryRegistrator = new RepositoriesRegistrator()
    .scope(Scope.Credential)
    .addSpecification(new InMemoryGetCredentialByEmail());

  const kernel = new Kernel(repositoryRegistrator, connectionManagerBuilder);
  const context = kernel.newContext();

  it('should be able to get credential from in-memory store by username.', async () => {
    const email = 'first.user123@gmail.com';
    const credRepository = context.repositories().Credential;
    const credential = await credRepository.getOne(new specs.GetByEmail(email));

    expect(credential.isNone).toBe(false);
    expect((credential.forceUnwrap() as Credential).isRegistered(email)).toBe(
      true
    );
  });

  afterAll(async () => {
    await context.close();
  });
});

describe('Use MongoDB as a datastore of repository.', () => {
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
    } finally {
      await mongoConnection.close();
    }
  });

  describe('MongoDB Query Repository of Credential.', () => {
    it('should be able to get one Credential by id.', async () => {
      const repositoryRegistrator = new RepositoriesRegistrator()
        .scope(Scope.Credential)
        .addSpecification(new MongoGetCredentialByID());

      const kernel = new Kernel(
        repositoryRegistrator,
        connectionManagerBuilder
      );
      const context = kernel.newContext();

      try {
        const tests = [
          {
            id: '6620b6e8d2e041357855e052',
            isNonable: true,
          },
          {
            id: DummyUser.mongoSpecTest[0].identifier,
            isNonable: false,
          },
          {
            id: DummyUser.mongoSpecTest[1].identifier,
            isNonable: false,
          },
          {
            id: DummyUser.mongoSpecTest[2].identifier,
            isNonable: false,
          },
        ];

        for (const test of tests) {
          const credential = await context
            .repositories()
            .Credential.getOne(new specs.GetByIDStr(test.id));

          expect(credential.isNone).toBe(test.isNonable);
        }
      } finally {
        await context.close();
      }
    });

    it.todo('should be able to get one Credential by email.');
    it.todo('should be able to get one Credential by accountNumber.');
    it.todo('should be able to get one Credential by identityNumber.');
  });

  describe('MongoDB Command Repository of Credential.', () => {
    it.todo('should be able the register credential.');
    it.todo('should be able the update credential.');
    it.todo('should be able the delete credential.');
  });
});
