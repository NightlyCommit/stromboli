const Stromboli = require('../');
const StromboliComponent = require('../lib/component');
const test = require('tap').test;
const path = require('path');
const fs = require('fs');

const Plugin = require('./plugins/plugin');

test('start', function (t) {
  var stromboli = new Stromboli();

  stromboli.setLogLevel('silent');

  t.plan(1);

  var plugins = {
    first: {
      entry: 'index.1',
      module: Plugin
    },
    second: {
      entry: 'index.2',
      module: Plugin
    }
  };

  var config = {
    componentRoot: 'test/start',
    plugins: plugins
  };

  return stromboli.start(config).then(
    function (components) {
      t.equal(components.length, 1);
    },
    function (err) {
      t.fail(err);
    }
  );
});