import {Credential} from '../../domain/Credential';
import {GetByEmail, GetByIDStr, GetByNumber} from '../../domain/specification';
import {Optional} from '../../package/monad/Optional';
import {IContext} from '../IContext';
import {RequestForm} from '../RequestForm';
import {CredentialOutput} from '../dto/CredentialOutput';

export class CredentialController {
  public async getByID(context: IContext, req: RequestForm) {
    const id = Optional.auto(req.Auth?.id).unwrap('');

    const credRepo = context.repositories().Credential;
    const row = await credRepo.getOne(new GetByIDStr(id));

    if (row.isNone) {
      return;
    }

    const credential = row.forceUnwrap() as Credential;
    const output = credential.out(CredentialOutput.build);

    return output;
  }

  public async getByEmail(context: IContext, req: RequestForm) {
    const email = Optional.auto(req.Query['email']).unwrap('');

    const credRepo = context.repositories().Credential;
    const row = await credRepo.getOne(new GetByEmail(email));

    if (row.isNone) {
      return;
    }

    const credential = row.forceUnwrap() as Credential;
    const output = credential.out(CredentialOutput.build);

    return output;
  }

  public async getByNumber(context: IContext, req: RequestForm) {
    const identity = Optional.auto(req.Query['identity']);
    const account = Optional.auto(req.Query['account']);

    const credRepo = context.repositories().Credential;
    const row = await credRepo.getOne(new GetByNumber(identity, account));

    if (row.isNone) {
      return;
    }

    const credential = row.forceUnwrap() as Credential;
    const output = credential.out(CredentialOutput.build);

    return output;
  }
}
