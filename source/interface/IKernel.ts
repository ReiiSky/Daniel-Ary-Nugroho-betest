import {IContext} from '../application/IContext';

export interface IKernel {
  newContext(): IContext;
}
