import {Connection} from './Connection';
import {MongoConfig} from './MongoConfig';
import {ClientSession, Db, MongoClient, ServerApiVersion} from 'mongodb';
import {Technames} from './Technames';

export class MongoConnection extends Connection {
  private connected = false;
  private _client: MongoClient | undefined;
  private _session: ClientSession | undefined;
  private isAborted = false;

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

    // TODO: Catch mongo connection error,
    // convert it to NonRecoverableError,
    // such as ConnectError.
    await this._client.connect();
    await this.ping();
    await this.begin();
  }

  private async begin() {
    this._session = this._client?.startSession();
    this._session?.startTransaction();
  }

  async close(): Promise<void> {
    await this.ping();
    await this._session?.endSession();
    await this._client?.close(true);
  }

  async abort() {
    await this._session?.abortTransaction();
    this.isAborted = true;
  }

  async commit() {
    if (this.session.transaction.isCommitted || this.isAborted) {
      return;
    }

    await this._session?.commitTransaction();
  }

  private async ping() {
    await this._client?.db('admin').command({ping: 1});
  }

  // TODO: use Optional to prevent null pointer exception,
  // but is not necesarry. It will throw on connect before reach this func.
  get db(): Db {
    return (this._client as MongoClient).db(this.config.dbname.unwrap(''));
  }

  get session(): ClientSession {
    return this._session as ClientSession;
  }
}
