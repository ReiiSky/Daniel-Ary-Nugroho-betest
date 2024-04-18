import {IContext} from './IContext';

export namespace KernelContext {
  export interface IKernel {
    newContext(): IContext;
  }
}
