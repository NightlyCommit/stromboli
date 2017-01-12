const Stromboli = require('../');
const StromboliComponent = require('../lib/component');
const test = require('tap').test;
const path = require('path');
const fs = require('fs');

const Plugin = require('./plugins/plugin');

test('build single component', function (t) {
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
    function(component) {
      t.type(component.renderResults, 'Map');
      t.equal(Array.from(component.renderResults.keys()).length, 3);

      var binaries = null;
      var firstResult = component.renderResults.get('first');

      binaries = firstResult.getBinaries();

      t.type(binaries, 'Array');
      t.equal(binaries.length, 1);
      t.equal(binaries[0].name, 'index.first.bin');

      var secondResult = component.renderResults.get('second');

      binaries = secondResult.getBinaries();

      t.type(binaries, 'Array');
      t.equal(binaries.length, 1);
      t.equal(binaries[0].name, 'index.second.bin');

      var secondAgainResult = component.renderResults.get('second-again');

      binaries = secondAgainResult.getBinaries();

      t.type(binaries, 'Array');
      t.equal(binaries.length, 1);
      t.equal(binaries[0].name, 'index-again.second.bin');
    },
    function(err) {
      t.fail(err);
    }
  );
});