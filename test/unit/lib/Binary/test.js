const {StromboliBinary} = require('../../../../build/lib/Binary');
const tap = require('tap');

tap.test('Binary', (test) => {
  let data = Buffer.from('bar');
  let map = Buffer.from('map');
  let dependencies = ['foo'];

  test.test('constructor', (test) => {
    test.test('accept 2 parameters', (test) => {
      let binary = new StromboliBinary('foo', data);

      test.equals(binary.name, 'foo');
      test.equals(binary.data, data);
      test.equals(binary.map, null);
      test.same(binary.dependencies, []);

      test.end();
    });

    test.test('accept 3 parameters', (test) => {
      let binary = new StromboliBinary('foo', data, map);

      test.equals(binary.name, 'foo');
      test.equals(binary.data, data);
      test.equals(binary.map, map);
      test.same(binary.dependencies, []);

      test.end();
    });

    test.test('accept 4 parameters', (test) => {
      let binary = new StromboliBinary('foo', data, map, dependencies);

      test.equals(binary.name, 'foo');
      test.equals(binary.data, data);
      test.equals(binary.map, map);
      test.equals(binary.dependencies, dependencies);

      test.end();
    });

    test.end();
  });

  test.end();
});