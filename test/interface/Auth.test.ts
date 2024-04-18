import {Local} from '../../source/infrastructure/environment/Local';
import {AuthPayload} from '../../source/application/AuthPayload';
import {IAuthorizer} from '../../source/interface/IAuthorizer';
import {Jwt} from '../../source/interface/authorizer/Jwt';

test('JWT Authorizer encode and parse', () => {
  const local = new Local('./config/.env');
  const JWTKey = local.getString('JWT_KEY');

  if (JWTKey.isNone) {
    return;
  }

  const authorizer: IAuthorizer<AuthPayload> = new Jwt(JWTKey.forceUnwrap());
  const jwtPayload = {id: 'iou3o213sadm'};

  const decoded = authorizer.Decode(jwtPayload);
  expect(decoded.length).toBeGreaterThan(16);

  const [parsed, error] = authorizer.Parse(decoded);
  expect(error.forceUnwrap()).toBeUndefined();
  expect(parsed.forceUnwrap()).toMatchObject(jwtPayload);
});
