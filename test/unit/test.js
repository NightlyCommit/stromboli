const lib = require('../../build');

const tap = require('tap');
const path = require('path');

tap.test('lib', function (test) {
  let expected = [
    'StromboliBinary',
    'StromboliBuilder',
    'StromboliComponent',
    'StromboliBuildRequest',
    'StromboliBuildResponse',
    'StromboliError',
    'StromboliPlugin',
  ];

  for (let key of expected) {
    test.true(lib[key], `${key} is exported`);
  }

  for (let key in lib) {
    test.true(expected.includes(key), `${key} is legit`);
  }

  test.end();
});