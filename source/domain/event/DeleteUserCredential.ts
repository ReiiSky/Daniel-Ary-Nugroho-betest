import {Identifier} from '../object/Identifier';

export class DeleteUserCredential {
  public constructor(public readonly identifier: Identifier<string>) {}

  public get eventname() {
    return DeleteUserCredential.name;
  }
}
