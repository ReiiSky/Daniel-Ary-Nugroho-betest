export abstract class Connection {
  constructor(public readonly techname: string) {}

  abstract connect(): Promise<void>;
  abstract abort(): Promise<void>;
  abstract commit(): Promise<void>;
  abstract close(): Promise<void>;
}
