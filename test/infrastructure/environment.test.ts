import {Local} from '../../source/infrastructure/environment/Local';
import {EmptyValue} from '../../source/package/EmptyValue';

test('Local Environment get value', () => {
  const local = new Local('./config/.env');

  const appName = local.getString('APPLICATION_NAME');
  expect(appName.unwrap(EmptyValue.DefaultString)).toBe('tech-testing');
});
