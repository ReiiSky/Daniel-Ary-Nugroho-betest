import {Optional} from './monad/Optional';

export abstract class RecoverableError extends Error {
  public static readonly source = 'client';

  // TODO: add custom code field,
  // such as P001, stand for first error of Package.
  public constructor(
    public readonly message: string,
    public readonly solution: Optional<string>
  ) {
    super(message);
  }
}
