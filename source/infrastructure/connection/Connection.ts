export abstract class Connection {
  constructor(public readonly techname: string) {}

  abstract connect(): Promise<void>;
  abstract close(): Promise<void>;
}
