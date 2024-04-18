import {Connection} from './Connection';
import {MongoConfig} from './MongoConfig';
import {Db, MongoClient, ServerApiVersion} from 'mongodb';
import {Technames} from './Technames';

export class MongoConnection extends Connection {
  private connected = false;
  private _client: MongoClient | undefined;

  constructor(private readonly config: MongoConfig) {
    super(Technames.MONGO);
  }

  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    const completeURI = this.config.url.replace(
      '<password>',
      this.config.password
    );
    this._client = new MongoClient(completeURI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await this._client.connect();
    await this.ping();
  }

  async close(): Promise<void> {
    await this.ping();
    await this._client?.close(true);
  }

  async ping() {
    await this._client?.db('admin').command({ping: 1});
  }

  // TODO: use Optional to prevent null pointer exception,
  // but is not necesarry. It will throw on connect before reach this func.
  get db(): Db {
    return (this._client as MongoClient).db(this.config.dbname.unwrap(''));
  }
}
