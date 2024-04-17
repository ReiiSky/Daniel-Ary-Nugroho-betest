import {ConnectionManager} from './ConnectionManager';
import {IConnectionBuilder} from './connection/IConnectionBuilder';

export class ConnectionManagerBuilder {
  constructor(private readonly connectionBuilders: IConnectionBuilder[] = []) {}

  public add(connectionBuilder: IConnectionBuilder) {
    this.connectionBuilders.push(connectionBuilder);

    return this;
  }

  public build(): ConnectionManager {
    const connections = this.connectionBuilders.map(builder => builder.build());
    return new ConnectionManager(connections);
  }
}
