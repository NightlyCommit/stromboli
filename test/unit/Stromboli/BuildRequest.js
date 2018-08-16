const {StromboliBuildRequest} = require('../../../lib/Stromboli/BuildRequest');
const {StromboliComponent, StromboliPlugin} = require('../../../lib/index');

const tap = require('tap');

tap.test('BuildRequest', (test) => {
  let component = new StromboliComponent('foo', 'bar', new Buffer('data'));
  let plugin = new StromboliPlugin('foo', 'bar', 'output', []);

  test.test('constructor', (test) => {
    let buildRequest = new StromboliBuildRequest(component, plugin);

    test.same(buildRequest.component, component);
    test.same(buildRequest.plugin, plugin);

    test.end();
  });

  test.end();
});