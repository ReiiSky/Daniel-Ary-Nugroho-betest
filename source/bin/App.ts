import {Scope} from '../domain/Scope';
import {ConnectionManagerBuilder} from '../infrastructure/ConnectionManagerBuilder';
import {Kernel} from '../infrastructure/Kernel';
import {RepositoriesRegistrator} from '../infrastructure/RepositoriesRegistrator';
import {MongoBuilder} from '../infrastructure/connection/MongoBuilder';
import {RedisBuilder} from '../infrastructure/connection/RedisBuilder';
import {Local} from '../infrastructure/environment/Local';
import {DecoratorRedisGetCredential} from '../infrastructure/repositoryimpl/DecoratorRedisGetCredential';
import {MongoDeleteCredential} from '../infrastructure/repositoryimpl/MongoDeleteCredential';
import {MongoGetCredentialByEmail} from '../infrastructure/repositoryimpl/MongoGetCredentialByEmail';
import {MongoGetCredentialByID} from '../infrastructure/repositoryimpl/MongoGetCredentialByID';
import {MongoGetCredentialByNumber} from '../infrastructure/repositoryimpl/MongoGetCredentialByNumber';
import {MongoRegisterCredential} from '../infrastructure/repositoryimpl/MongoRegisterCredential';
import {MongoUpdateCredential} from '../infrastructure/repositoryimpl/MongoUpdateCredential';
import {IKernel} from '../interface/IKernel';
import {EmptyValue} from '../package/EmptyValue';

export class App {
  public static readonly local = new Local('/etc/secrets/.env');

  setupKernel(): IKernel {
    const mongoURL = App.local
      .getString('MONGO_URL')
      .unwrap(EmptyValue.DefaultString);

    const mongoDBName = App.local.getString('MONGO_DBNAME');
    const mongoPassword = App.local
      .getString('MONGO_PASSWORD')
      .unwrap(EmptyValue.DefaultString);

    const connectionManagerBuilder = new ConnectionManagerBuilder();
    connectionManagerBuilder.add(
      new MongoBuilder({
        url: mongoURL,
        dbname: mongoDBName,
        password: mongoPassword,
      })
    );

    const redisURL = App.local
      .getString('REDIS_URL')
      .unwrap(EmptyValue.DefaultString);

    const redisPassword = App.local
      .getString('REDIS_PASSWORD')
      .unwrap(EmptyValue.DefaultString);

    connectionManagerBuilder.add(
      new RedisBuilder({
        url: redisURL,
        password: redisPassword,
        ttl: 300,
      })
    );

    const repositoryRegistrator = new RepositoriesRegistrator()
      .scope(Scope.Credential)
      .addSpecification(
        new DecoratorRedisGetCredential(new MongoGetCredentialByID())
      )
      .addSpecification(new MongoGetCredentialByEmail())
      .addSpecification(new MongoGetCredentialByNumber())
      .addEvent(new MongoRegisterCredential())
      .addEvent(new MongoUpdateCredential())
      .addEvent(new MongoDeleteCredential());

    return new Kernel(repositoryRegistrator, connectionManagerBuilder);
  }
}
