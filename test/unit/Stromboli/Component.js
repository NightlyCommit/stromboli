const {StromboliComponent} = require('../../../lib/Stromboli/Component');
const tap = require('tap');

tap.test('Component', (test) => {
  test.test('constructor', (test) => {
    let component = new StromboliComponent('foo', 'bar');

    test.equals(component.name, 'foo');
    test.equals(component.path, 'bar');

    test.end();
  });

  test.end();
});