import * as express from 'express';
import * as morgan from 'morgan';
import {App} from './App';
import {ExpressAdapter} from '../interface/adapter/ExpressAdapter';
import {Jwt} from '../interface/authorizer/Jwt';
import {Controller} from '../application/Controller';
import {EmptyValue} from '../package/EmptyValue';

export class ExpressSetup {
  private readonly app = express();
  private readonly adapter: ExpressAdapter;

  constructor() {
    this.app.use(express.json({limit: '2048kb'}));
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(morgan('short'));

    const kernel = new App().setupKernel();
    const authorizerKey = App.local
      .getString('JWT_SECRET_KEY')
      .unwrap(EmptyValue.DefaultString);
    const authorizer = new Jwt(authorizerKey);
    const controller = new Controller();

    this.adapter = new ExpressAdapter(kernel, authorizer, controller);
    this.setupRoute();
  }

  private setupRoute() {
    this.app.get('/credential', (req, res) =>
      this.adapter.getCredential(req, res)
    );
    this.app.put('/credential', (req, res) =>
      this.adapter.updateCredential(req, res)
    );
    this.app.post('/credential', (req, res) =>
      this.adapter.registerCredential(req, res)
    );
    this.app.delete('/credential', (req, res) =>
      this.adapter.deleteCredential(req, res)
    );

    this.app.get('/token', (req, res) => this.adapter.generateToken(req, res));
  }

  run() {
    // const PORT = App.local.getNumber('PORT').unwrap(8000);
    const PORT = process.env.PORT || 8000;

    this.app.listen(PORT, () => {
      console.log('listening on port: ' + PORT);
    });
  }
}

export const server = new ExpressSetup();
