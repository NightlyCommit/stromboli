const {Error} = require('../../../../build/cjs/lib/Error');
const tape = require('tape');

tape.test('Error', (test) => {
  test.test('constructor', (test) => {
    let error = new Error('foo', 'bar');

    test.equals(error.file, 'foo');
    test.equals(error.message, 'bar');

    test.end();
  });

  test.end();
});