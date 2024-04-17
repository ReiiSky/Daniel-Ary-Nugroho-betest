import {Optional} from '../../package/monad/Optional';
import {Identifier} from '../object/Identifier';
import {InformationNumber} from '../object/InfomationNumber';
import {Username} from '../object/Username';

export class UpdateUserCredentials {
  public constructor(
    public readonly identifier: Identifier<string>,
    public readonly username = Optional.none<Username>(),
    public readonly accountNumber = Optional.none<InformationNumber<string>>()
  ) {}

  public get eventname() {
    return UpdateUserCredentials.name;
  }
}
