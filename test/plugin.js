const Stromboli = require('../');
const test = require('tap').test;
const path = require('path');
const fs = require('fs');

test('get plugins', function (t) {
  var stromboli = new Stromboli();

  var config = {
    plugins: {
      first: {
        module: require('./plugins/plugin'),
        entry: 'index.first',
        config: {
          test: 'dummy'
        }
      },
      second: {
        module: require('./plugins/plugin'),
        entry: 'index.second'
      }
    }
  };

  t.plan(4);

  return stromboli.getPlugins(config).then(
    function(plugins) {
      t.equal(plugins.length, 2);
      t.equal(plugins[0].name, 'first');
      t.equal(plugins[0].entry, 'index.first');
      t.equal(plugins[0].plugin.config.test, 'dummy');
    },
    function(err) {
      t.fail(err);
    }
  );
});