import {AuthPayload} from '../../application/AuthPayload';
import {Controller} from '../../application/Controller';
import {RequestForm} from '../../application/RequestForm';
import {Optional} from '../../package/monad/Optional';
import {IAuthorizer} from '../IAuthorizer';
import {IKernel} from '../IKernel';
import * as express from 'express';

export class ExpressAdapter {
  constructor(
    private readonly kernel: IKernel,
    private readonly authorizer: IAuthorizer<AuthPayload>,
    private readonly controller: Controller
  ) {}

  private convertFromExpress(req: express.Request): RequestForm {
    const reqForm: RequestForm = {Query: this.convertQueryForm(req.query)};
    const authorization = Optional.auto(req.headers.authorization)
      .use(auth => auth.replace('Bearer ', ''))
      .unwrap('');

    if (authorization.length >= 8) {
      const [payload] = this.authorizer.Parse(authorization);
      payload.use(p => (reqForm.Auth = p));
    }

    reqForm.Body = req.body;

    return reqForm;
  }

  private convertQueryForm(query: qs.ParsedQs): {
    [key: string]: string | undefined;
  } {
    const result: {[key: string]: string} = {};

    for (const [key, value] of Object.entries(query)) {
      // TODO: parse other type like ParsedQs
      // implementation below is enough for small case.
      if (typeof value === 'string') {
        result[key] = value;
      }
    }

    return result;
  }

  private toJSON<T>(
    res: express.Response,
    statusCode: number,
    data?: T,
    message?: string
  ) {
    res.status(statusCode).json({
      data: data,
      message: message,
    });
  }

  public async getCredential(req: express.Request, res: express.Response) {
    const context = this.kernel.newContext();
    const reqForm = this.convertFromExpress(req);

    let output;

    if (typeof reqForm.Auth?.id === 'string') {
      output = await this.controller.Credential.getByID(context, reqForm);
    } else if (typeof reqForm.Query['email'] === 'string') {
      output = await this.controller.Credential.getByEmail(context, reqForm);
    } else if (
      typeof reqForm.Query['account'] === 'string' ||
      typeof reqForm.Query['identity'] === 'string'
    ) {
      output = await this.controller.Credential.getByNumber(context, reqForm);
    }

    this.toJSON(res, 200, output);
  }

  public async updateCredential(req: express.Request, res: express.Response) {
    const context = this.kernel.newContext();
    const reqForm = this.convertFromExpress(req);

    await this.controller.Credential.update(context, reqForm);

    this.toJSON(res, 200, null, 'ok');
  }

  public async registerCredential(req: express.Request, res: express.Response) {
    const context = this.kernel.newContext();
    const reqForm = this.convertFromExpress(req);

    await this.controller.Credential.register(context, reqForm);

    this.toJSON(res, 200, null, 'ok');
  }

  public async deleteCredential(req: express.Request, res: express.Response) {
    const context = this.kernel.newContext();
    const reqForm = this.convertFromExpress(req);

    await this.controller.Credential.delete(context, reqForm);

    this.toJSON(res, 200, null, 'ok');
  }

  public async generateToken(req: express.Request, res: express.Response) {
    const context = this.kernel.newContext();
    const reqForm = this.convertFromExpress(req);
    const output = await this.controller.Credential.getByEmail(
      context,
      reqForm
    );

    if (!output?.id) {
      return this.toJSON(res, 400);
    }

    const jwt = this.authorizer.Decode({
      id: output.id,
    });

    return this.toJSON(res, 200, {
      token: jwt,
    });
  }
}
