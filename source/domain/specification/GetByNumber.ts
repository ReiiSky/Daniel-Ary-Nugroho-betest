import {Optional} from '../../package/monad/Optional';
import {InformationNumber} from '../object/InfomationNumber';

export class GetByNumber {
  public readonly identity: Optional<InformationNumber<string>>;
  public readonly account: Optional<InformationNumber<string>>;

  constructor(
    identity = Optional.none<string>(),
    account = Optional.none<string>()
  ) {
    this.identity = identity
      .use(num => Optional.some(InformationNumber.new(num)))
      .unwrap(Optional.none());

    this.account = account
      .use(num => Optional.some(InformationNumber.new(num)))
      .unwrap(Optional.none());
  }

  public get specname() {
    return GetByNumber.name;
  }
}
