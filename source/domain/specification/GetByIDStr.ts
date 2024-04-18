import {SNValidator} from '../object/SNValidator';

export class GetByIDStr {
  public readonly id: string;

  constructor(id: string) {
    SNValidator.validate(GetByIDStr.name, id);
    this.id = id;
  }

  public get specname() {
    return GetByIDStr.name;
  }
}
