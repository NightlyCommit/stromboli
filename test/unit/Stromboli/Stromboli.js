const {Stromboli} = require('../../../lib/Stromboli/Stromboli');
const {StromboliComponent, StromboliPlugin} = require('../../../lib/index');
const tap = require('tap');

class FooProcessor {
  /**
   * @param {StromboliBuildRequest} buildRequest
   * @param {StromboliBuildResponse} buildResponse
   */
  process(buildRequest, buildResponse) {
    buildResponse.addBinary('bin1', new Buffer('bin1data'));
    buildResponse.addBinary('bin2', new Buffer('bin2data'), new Buffer('bin2map'));

    buildResponse.addDependency('dep1');
    buildResponse.addDependency('dep2');
    buildResponse.addDependency('dep3');
  }
}

class ErrorProcessor {
  /**
   * @param {StromboliBuildRequest} buildRequest
   * @param {StromboliBuildResponse} buildResponse
   */
  process(buildRequest, buildResponse) {
    buildResponse.addBinary('bin1', new Buffer('bin1data'));

    buildResponse.addDependency('dep1');

    buildResponse.addError('err1message', 'err1file');
  }
}

tap.test('Stromboli', (test) => {
  test.test('constructor', (test) => {
    let stromboli = new Stromboli();

    test.true(stromboli);

    test.end();
  });

  test.test('buildComponentWithPlugin', async (test) => {
    let stromboli = new Stromboli();

    let component = new StromboliComponent('foo', 'bar');
    let plugin = new StromboliPlugin('plugin1', 'foo.entry', 'foo.output', [
      new FooProcessor(),
      new ErrorProcessor()
    ]);

    let result = await stromboli.buildComponentWithPlugin(component, plugin);

    test.equals(result.binaries.length, 2);
    test.equals(result.dependencies.length, 3);
    test.equals(result.errors.length, 1);

    test.end()
  });

  test.test('buildComponent', async (test) => {
    let stromboli = new Stromboli();

    let component = new StromboliComponent('foo', '/foo');

    let plugins = [
      new StromboliPlugin('plugin1', 'foo.entry1', 'foo.output1', [
        new FooProcessor()
      ]),
      new StromboliPlugin('plugin2', 'foo.entry2', 'foo.output2', [
        new ErrorProcessor()
      ])
    ];

    let results = await stromboli.buildComponent(component, plugins);

    test.true(results.has('plugin1'));
    test.true(results.has('plugin2'));

    test.end();
  });

  test.test('start', async (test) => {
    let stromboli = new Stromboli();

    let components = [
      new StromboliComponent('foo', '/foo'),
      new StromboliComponent('bar', '/bar')
    ];

    let plugins = [
      new StromboliPlugin('plugin1', 'foo.entry1', 'foo.output1', [
        new FooProcessor()
      ]),
      new StromboliPlugin('plugin2', 'foo.entry2', 'foo.output2', [
        new ErrorProcessor()
      ])
    ];

    let results = await stromboli.start(components, plugins);

    test.equals(results.length, 2);

    test.end();
  });

  test.end();
});