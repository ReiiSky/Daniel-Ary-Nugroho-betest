import {AuthPayload} from './AuthPayload';

export interface RequestForm {
  Auth?: AuthPayload;
  Query: {
    [key: string]: string | undefined;
  };
  Body?: string;
}
