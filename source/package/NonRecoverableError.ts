export abstract class NonRecoverableError extends Error {
  public static readonly source = 'server';

  public constructor(public readonly message: string) {
    super(message);
  }
}
