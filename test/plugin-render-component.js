const Stromboli = require('../src');
const StromboliComponent = require('../src/lib/component');

const test = require('tap').test;
const path = require('path');

test('pluginRenderComponent', function (test) {
  var stromboli = new Stromboli();

  test.test('should resolve to a render result', function (test) {
      var Plugin = require('./plugins/plugin');

      var component = new StromboliComponent('foo', 'test/build/single');
      var plugin = {
        name: 'first',
        module: new Plugin(),
        entry: 'index.first'
      };

      stromboli.pluginRenderComponent(plugin, component).then(
        function (renderResult) {
          test.same(renderResult.source, path.resolve('test/build/single/index.first'));
          test.same(renderResult.binaryDependencies, [
            path.resolve('test/build/single/index.first.dep.bin')
          ]);
          test.same(renderResult.sourceDependencies, [
            path.resolve('test/build/single/index.first'),
            path.resolve('test/build/single/index.first.dep.src')
          ]);

          test.end();
        },
        function (err) {
          test.fail(err.message);

          test.end();
        }
      )
    }
  );

  test.end();
});