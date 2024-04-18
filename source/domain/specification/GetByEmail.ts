import {Email} from '../object/Email';

export class GetByEmail {
  public readonly email: string;

  constructor(email: string) {
    this.email = Email.validate(email);
  }

  public get specname() {
    return GetByEmail.name;
  }
}
