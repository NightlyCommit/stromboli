const Stromboli = require('../');
const StromboliComponent = require('../lib/component');
const tap = require('tap');
const path = require('path');
const fs = require('fs');
const sinon = require('sinon');

const Plugin = require('./plugins/plugin');

tap.test('build single component', function (t) {
  var stromboli = new Stromboli();

  t.plan(11);

  var component = new StromboliComponent('my-component', 'test/build/single');

  var plugins = [
    {
      name: 'first',
      entry: 'index.first',
      module: new Plugin()
    },
    {
      name: 'second',
      entry: 'index.second',
      module: new Plugin()
    },
    {
      name: 'second-again',
      entry: 'index.second',
      output: 'index-again.second.bin',
      module: new Plugin()
    }
  ];

  return stromboli.buildComponent(component, plugins).then(
    function (component) {
      t.type(component.renderResults, 'Map');
      t.equal(Array.from(component.renderResults.keys()).length, 3);

      var binaries = null;
      var firstResult = component.renderResults.get('first');

      binaries = firstResult.binaries;

      t.type(binaries, 'Array');
      t.equal(binaries.length, 1);
      t.equal(binaries[0].name, 'index.first.bin');

      var secondResult = component.renderResults.get('second');

      binaries = secondResult.binaries;

      t.type(binaries, 'Array');
      t.equal(binaries.length, 1);
      t.equal(binaries[0].name, 'index.second.bin');

      var secondAgainResult = component.renderResults.get('second-again');

      binaries = secondAgainResult.binaries;

      t.type(binaries, 'Array');
      t.equal(binaries.length, 1);
      t.equal(binaries[0].name, 'index-again.second.bin');
    },
    function (err) {
      t.fail(err);
    }
  );
});

tap.test('build with error', function (test) {
  let componentPath = 'test/build/single';
  let stromboli = new Stromboli();
  let component = new StromboliComponent('my-component', componentPath);

  stromboli.setLogLevel('warn');

  test.beforeEach(function(done) {
    sinon.stub(stromboli.logger, 'error');

    done();
  });

  test.afterEach(function(done) {
    stromboli.logger.error.restore();

    done();
  });

  let executeTest = function(Plugin, wanted) {
    return function(subtest) {
      let plugins = [
        {
          name: 'error',
          entry: 'index.first',
          module: new Plugin()
        }
      ];

      return stromboli.buildComponent(component, plugins).then(
        function (component) {
          let renderResult = component.renderResults.get('error');

          subtest.equal(renderResult.source.file, path.resolve(path.join(componentPath, 'index.first')));
          subtest.same(renderResult.source.error, wanted);
          subtest.equal(stromboli.logger.error.callCount, 1);
        },
        function (err) {
          subtest.fail(err);
        }
      )
    }
  };

  test.plan(3);

  test.test('error as message', executeTest(require('./plugins/error'), 'Dummy error'));
  test.test('error with message', executeTest(require('./plugins/error-with-message'), {message: 'Dummy error'}));
  test.test('error with file', executeTest(require('./plugins/error-with-file'), {
    file: 'dummy',
    message: 'Dummy error'
  }));
});