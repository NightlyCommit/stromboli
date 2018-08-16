const {StromboliError} = require('../../../lib/Stromboli/Error');
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