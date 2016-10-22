const Stromboli = require('../');
const test = require('tap').test;
const path = require('path');
const fs = require('fs');

test('get components', function (t) {
  var stromboli = new Stromboli();

  t.plan(5);

  return stromboli.getComponents('test/components', 'component.json').then(
    function(components) {
      t.equal(components.length, 2);

      var component = components[0];

      t.type(component, 'StromboliComponent');
      t.ok(component.name);
      t.ok(component.path);
      t.type(component.renderResults, 'Map');
    },
    function(err) {
      t.fail(err);
    }
  );
});