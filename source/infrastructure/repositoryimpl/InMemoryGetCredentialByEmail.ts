import {Credential} from '../../domain/Credential';
import {GetByEmail} from '../../domain/specification/GetByEmail';
import {ConnectionManager} from '../ConnectionManager';
import {InMemory} from './InMemory';

export class InMemoryGetCredentialByEmail extends InMemory {
  async query(
    manager: ConnectionManager,
    spec: GetByEmail
  ): Promise<Credential[]> {
    const connection = await super.getConn(manager);
    const filteredData = connection.rows
      // assume all data is valid, skip throwable rows.
      .filter(row => !row.throwable)
      .filter(row => row.userPayload.email === spec.email)
      .map(row => row.userPayload);

    if (filteredData.length <= 0) {
      return [];
    }

    return filteredData.map(row => Credential.new(row.identifier, row));
  }

  get specname(): string {
    return GetByEmail.name;
  }
}
