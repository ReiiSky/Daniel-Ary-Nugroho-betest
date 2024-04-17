import {Connection} from './Connection';
import {MongoConfig} from './MongoConfig';
import {MongoClient, ServerApiVersion} from 'mongodb';
import {Technames} from './Technames';

export class MongoConnection extends Connection {
  private connected = false;
  private client: MongoClient | undefined;

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
    this.client = new MongoClient(completeURI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await this.client.connect();
    await this.ping();
  }

  async close(): Promise<void> {
    await this.ping();
    await this.client?.close(true);
  }

  async ping() {
    await this.client?.db('admin').command({ping: 1});
  }
}
