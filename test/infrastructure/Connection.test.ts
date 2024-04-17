import {ConnectionManagerBuilder} from '../../source/infrastructure/ConnectionManagerBuilder';
import {MongoBuilder} from '../../source/infrastructure/connection/MongoBuilder';
import {MongoConfig} from '../../source/infrastructure/connection/MongoConfig';
import {Technames} from '../../source/infrastructure/connection/Technames';
import {Local} from '../../source/infrastructure/environment/Local';
import {EmptyValue} from '../../source/package/EmptyValue';

describe('MongoDB create connection', () => {
  const local = new Local('./config/.env');
  const mongoURL = local
    .getString('MONGO_URL')
    .unwrap(EmptyValue.DefaultString);
  const mongoPassword = local
    .getString('MONGO_PASSWORD')
    .unwrap(EmptyValue.DefaultString);

  if (mongoURL === EmptyValue.DefaultString || mongoURL.length <= 8) {
    return;
  }

  it('should be able to connect and close with valid config.', async () => {
    const mongoConfig: MongoConfig = {
      url: mongoURL,
      password: mongoPassword,
    };

    const builder = new MongoBuilder(mongoConfig);
    const mongoClient = builder.build();

    expect(mongoClient.connect()).resolves.toBeUndefined();
    await mongoClient.close();
  });

  it('should not be able to connect with invalid config.', () => {
    const mongoConfig: MongoConfig = {
      url: '',
      password: '',
    };

    const builder = new MongoBuilder(mongoConfig);
    const mongoClient = builder.build();

    expect(mongoClient.connect()).rejects.toThrow();
  });
});

describe('Store Mongo connection to ConnectionManagerBuilder', () => {
  const local = new Local('./config/.env');
  const mongoURL = local
    .getString('MONGO_URL')
    .unwrap(EmptyValue.DefaultString);
  const mongoPassword = local
    .getString('MONGO_PASSWORD')
    .unwrap(EmptyValue.DefaultString);

  if (mongoURL === EmptyValue.DefaultString || mongoURL.length <= 8) {
    return;
  }

  const mongoConfig: MongoConfig = {
    url: mongoURL,
    password: mongoPassword,
  };

  const connectionManagerBuilder = new ConnectionManagerBuilder();
  connectionManagerBuilder.add(new MongoBuilder(mongoConfig));

  const connectionManager = connectionManagerBuilder.build();

  it('should be able to get mongo connection.', () => {
    expect(connectionManager.get(Technames.MONGO)).resolves.not.toBeUndefined();
  });

  afterAll(async () => {
    await connectionManager.closeAll();
  });
});
