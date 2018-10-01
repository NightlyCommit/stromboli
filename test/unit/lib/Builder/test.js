const {StromboliBuilder} = require('../../../../build/lib/Builder');
const {StromboliComponent, StromboliPlugin} = require('../../../../build');
const tap = require('tap');
const sinon = require('sinon');

class FooProcessor {
  /**
   * @param {StromboliBuildRequest} buildRequest
   * @param {StromboliBuildResponse} buildResponse
   * @return {Promise<StromboliBuildResponse>}
   */
  process(buildRequest, buildResponse) {
    buildResponse.addBinary('bin1', new Buffer('bin1data'));
    buildResponse.addBinary('bin2', new Buffer('bin2data'), new Buffer('bin2map'));

    buildResponse.addDependency('dep1');
    buildResponse.addDependency('dep2');
    buildResponse.addDependency('dep3');

    return Promise.resolve();
  }
}

class BarProcessor {
  /**
   * @param {StromboliBuildRequest} buildRequest
   * @param {StromboliBuildResponse} buildResponse
   * @return {Promise<StromboliBuildResponse>}
   */
  process(buildRequest, buildResponse) {

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
    let stromboli = new StromboliBuilder();

    test.true(stromboli);

    test.end();
  });

  test.test('buildComponentWithPlugin', (test) => {
    let stromboli = new StromboliBuilder();

    let component = new StromboliComponent('foo', 'bar');
    let plugin = new StromboliPlugin('plugin1', 'foo.entry', 'foo.output', [
      new FooProcessor(),
      new ErrorProcessor()
    ]);

    stromboli.buildComponentWithPlugin(component, plugin).then(
      (result) => {
        test.equals(result.binaries.length, 3);
        test.equals(result.dependencies.length, 3);
        test.equals(result.errors.length, 1);

        test.end();
      }
    );

    test.test('processors are run sequentially', (test) => {
      let fooProcessor = new FooProcessor();
      let barProcessor = new BarProcessor();

      let value = null;
      let flag = false;

      sinon.stub(fooProcessor, 'process').callsFake((buildRequest, buildResponse) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            value = 'foo';

            resolve();
          }, 100);
        });
      });

      sinon.stub(barProcessor, 'process').callsFake((buildRequest, buildResponse) => {
        flag = (value === 'foo');

        return Promise.resolve();
      });

      let plugin = new StromboliPlugin('plugin1', 'foo.entry', 'foo.output', [
        fooProcessor,
        barProcessor
      ]);

      stromboli.buildComponentWithPlugin(component, plugin).then(
        () => {
          test.true(flag);

          test.end();
        }
      );
    });

    test.test('this is defined inside "process" function', (test) => {
      let fooProcessor = new FooProcessor();

      let flag = null;

      sinon.stub(fooProcessor, 'process').callsFake(function (buildRequest, buildResponse) {
        return new Promise((resolve, reject) => {
          flag = (this === fooProcessor);

          resolve();
        });
      });

      let plugin = new StromboliPlugin('plugin1', 'foo.entry', 'foo.output', [
        fooProcessor
      ]);

      stromboli.buildComponentWithPlugin(component, plugin).then(
        () => {
          test.true(flag);

          test.end();
        }
      );
    });
  });

  test.test('buildComponent', (test) => {
    let stromboli = new StromboliBuilder();

    let component = new StromboliComponent('foo', '/foo');

    let plugins = [
      new StromboliPlugin('plugin1', 'foo.entry1', 'foo.output1', [
        new FooProcessor()
      ]),
      new StromboliPlugin('plugin2', 'foo.entry2', 'foo.output2', [
        new ErrorProcessor()
      ])
    ];

    stromboli.buildComponent(component, plugins).then(
      (results) => {
        test.true(results.has('plugin1'));
        test.true(results.has('plugin2'));

        test.end();
      }
    );
  });

  test.test('start', (test) => {
    let stromboli = new StromboliBuilder();

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

    stromboli.start(components, plugins).then(
      (results) => {
        test.equals(results.length, 2);

        test.end();
      }
    );
  });

  test.end();
});