const lib = require('../../lib');

const tap = require('tap');
const path = require('path');

tap.test('Stromboli lib', function (test) {
  let exports = {
    StromboliBinary: './Stromboli/Binary',
    StromboliComponent: './Stromboli/Component',
    StromboliBuildRequest: './Stromboli/BuildRequest',
    StromboliBuildResponse: './Stromboli/BuildResponse',
    StromboliError: './Stromboli/Error',
    StromboliPlugin: './Stromboli/Plugin',
    Stromboli: './Stromboli/Stromboli',
  };

  for (let key in exports) {
    let fileName = exports[key];

    let exportedSymbol = require(path.resolve('lib', fileName))[key];

    test.same(exportedSymbol, lib[key], `${key} is exported`);
  }

  for (let key in lib) {
    test.true(exports[key], `${key} is legit`);
  }

  test.end();
});