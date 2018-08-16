const {StromboliBinary} = require('../../../lib/index');
const tap = require('tap');

tap.test('Binary', (test) => {
  let data = Buffer.from('bar');
  let map = Buffer.from('map');

  test.test('constructor', (test) => {

    test.test('accept 2 parameters', (test) => {
      let component = new StromboliBinary('foo', data);

      test.equals(component.name, 'foo');
      test.equals(component.data, data);
      test.equals(component.map, null);

      test.end();
    });

    test.test('accept 3 parameters', (test) => {
      let component = new StromboliBinary('foo', data, map);

      test.equals(component.name, 'foo');
      test.equals(component.data, data);
      test.equals(component.map, map);

      test.end();
    });

    test.end();
  });

  test.end();
});