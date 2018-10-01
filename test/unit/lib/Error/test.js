const {StromboliError} = require('../../../../build/lib/Error');
const tap = require('tap');

tap.test('Error', (test) => {
  test.test('constructor', (test) => {
    let error = new StromboliError('foo', 'bar');

    test.equals(error.file, 'foo');
    test.equals(error.message, 'bar');

    test.end();
  });

  test.end();
});