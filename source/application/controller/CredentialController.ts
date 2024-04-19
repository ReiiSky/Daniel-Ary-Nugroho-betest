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

  public async register(context: IContext, req: RequestForm) {
    // TODO: add validation on body parse.
    const body = req.Body as unknown as {
      email: string;
      username: string;
      number: {
        identity: string;
        account: string;
      };
    };

    // TODO: don't use other function in controller to check the logic.
    // use repository find instead.
    const isExist = await this.getByEmail(context, {
      Query: {
        email: body.email,
      },
    });
    if (isExist) return false;

    const repo = context.repositories();
    const credential = Credential.newEmpty();
    credential.register({
      email: body.email,
      username: body.username,
      number: {
        identity: body.number.identity,
        account: Optional.some(body.number.account),
      },
    });

    await repo.save(credential);

    return true;
  }

  public async update(context: IContext, req: RequestForm) {
    const id = Optional.auto(req.Auth?.id).unwrap('');

    const credRepo = context.repositories().Credential;
    const row = await credRepo.getOne(new GetByIDStr(id));

    if (row.isNone) {
      return;
    }

    const credential = row.forceUnwrap() as Credential;

    // TODO: add validation on body parse.
    const body = req.Body as {username?: string; account?: string};

    Optional.auto(body.username).use(name => credential.updateUsername(name));

    const account = Optional.auto(body.account);

    if (!account.isNone) {
      credential.updateAccountNumber(account);
    }

    const repo = context.repositories();
    await repo.save(credential);

    return true;
  }

  public async delete(context: IContext, req: RequestForm) {
    const id = Optional.auto(req.Auth?.id).unwrap('');

    const credRepo = context.repositories().Credential;
    const row = await credRepo.getOne(new GetByIDStr(id));

    if (row.isNone) {
      return;
    }

    const credential = row.forceUnwrap() as Credential;
    credential.delete();

    const repo = context.repositories();
    await repo.save(credential);

    return true;
  }
}
