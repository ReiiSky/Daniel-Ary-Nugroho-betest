import {UserPayload} from '../../domain/entity/UserPayload';

export abstract class CredentialOutput {
  public static build(id: string, payload: UserPayload) {
    return {
      id,
      username: payload.username,
      email: payload.email,
      number: {
        identity: payload.number.identity,
        account: payload.number.account.forceUnwrap(),
      },
    };
  }
}
