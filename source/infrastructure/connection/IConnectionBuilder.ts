import {Connection} from './Connection';

export interface IConnectionBuilder {
  build(): Connection;
}
