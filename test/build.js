const Stromboli = require('../');
const StromboliComponent = require('../lib/component');
const test = require('tap').test;
const path = require('path');
const fs = require('fs');

const Plugin = require('./plugins/plugin');

test('build single component', function (t) {
  var stromboli = new Stromboli();

  t.plan(4);

  var component = new StromboliComponent('my-component', 'test/build/single');

  var plugins = [
    {
      name: 'first',
      entry: 'index.first',
      plugin: new Plugin()
    },
    {
      name: 'second',
      entry: 'index.second',
      plugin: new Plugin()
    }
  ];

  return stromboli.buildComponent(component, plugins).then(
    function(component) {
      t.type(component.renderResults, 'Map');
      t.equal(Array.from(component.renderResults.keys()).length, 2);

      var firstResult = component.renderResults.get('first');
      var binaries = firstResult.getBinaries();

      t.type(binaries, 'Array');
      t.equal(binaries.length, 1);
    },
    function(err) {
      t.fail(err);
    }
  );
});