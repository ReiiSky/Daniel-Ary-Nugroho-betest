import {Optional} from '../../source/package/monad/Optional';

describe('Optional instead null, to handle variable value.', () => {
  const names = ['user-one', null, undefined];
  const useInvalidNames = names.map(name => name?.length || 0).map(l => l <= 0);
  const optionNames = names.map(name => Optional.auto(name));

  it('should apply the processing value.', () => {
    const optionalNameOne = optionNames[0];

    const newOptionalNameOne = optionalNameOne
      .use(name => 'my name is: ' + name)
      .use(greeting => greeting + ' hello world.');

    expect(newOptionalNameOne.unwrap('')).toBe(
      `my name is: ${names[0]} hello world.`
    );
  });

  it('should unwrap the value.', () => {
    for (let i = 0; i < optionNames.length; i++) {
      const defaultValue = 'invalid-name';
      const name = optionNames[i].unwrap(defaultValue);

      if (useInvalidNames[i]) {
        expect(name).toBe(defaultValue);
        continue;
      }

      expect(name).not.toBe(defaultValue);
    }
  });
});
