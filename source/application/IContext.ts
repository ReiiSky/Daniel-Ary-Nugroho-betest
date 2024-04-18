import {IRepositories} from './IRepositories';

export interface IContext {
  // TODO: add one function for storing
  // external registers, to be used for calling
  // external service. such as externals().Stripe;
  repositories(): IRepositories;
}
