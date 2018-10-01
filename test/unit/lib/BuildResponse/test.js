const {StromboliBuildResponse} = require('../../../../build/lib/BuildResponse');
const {StromboliBinary, StromboliError} = require('../../../../build');

const tap = require('tap');

tap.test('BuildResponse', (test) => {
  test.test('constructor', (test) => {
    let binaries = [
      new StromboliBinary('bin1', new Buffer('bin1')),
      new StromboliBinary('bin2', new Buffer('bin2'))
    ];

    let dependencies = [
      'dep1',
      'dep2'
    ];

    let errors = [
      new StromboliError('err1', 'msg1'),
      new StromboliError('err2', 'msg2')
    ];

    test.test('accept 0 parameter', (test) => {
      let buildResponse = new StromboliBuildResponse();

      test.same(buildResponse.binaries, []);
      test.same(buildResponse.dependencies, []);
      test.same(buildResponse.errors, []);

      test.end();
    });

    test.test('accept 1 parameter', (test) => {
      let buildResponse = new StromboliBuildResponse(binaries);

      test.equals(buildResponse.binaries, binaries);
      test.same(buildResponse.dependencies, []);
      test.same(buildResponse.errors, []);

      test.end();
    });

    test.test('accept 2 parameters', (test) => {
      let buildResponse = new StromboliBuildResponse(binaries, dependencies);

      test.equals(buildResponse.binaries, binaries);
      test.equals(buildResponse.dependencies, dependencies);
      test.same(buildResponse.errors, []);

      test.end();
    });

    test.test('accept 3 parameters', (test) => {
      let buildResponse = new StromboliBuildResponse(binaries, dependencies, errors);

      test.equals(buildResponse.binaries, binaries);
      test.equals(buildResponse.dependencies, dependencies);
      test.equals(buildResponse.errors, errors);

      test.end();
    });

    test.end();
  });

  test.test('addBinary', (test) => {
    test.test('accepts two parameters', (test) => {
      let buildResponse = new StromboliBuildResponse();

      let data = new Buffer('bar');

      buildResponse.addBinary('foo', data);

      let binary = buildResponse.binaries[0];

      test.true(binary);
      test.same(binary.name, 'foo');
      test.equals(binary.data, data);
      test.equals(binary.map, null);
      test.same(binary.dependencies, []);

      test.end();
    });

    test.test('accepts three parameters', (test) => {
      let buildResponse = new StromboliBuildResponse();

      let data = new Buffer('bar');
      let map = new Buffer('map');

      buildResponse.addBinary('foo', data, map);

      let binary = buildResponse.binaries[0];

      test.true(binary);
      test.same(binary.name, 'foo');
      test.equals(binary.data, data);
      test.equals(binary.map, map);
      test.same(binary.dependencies, []);

      test.end();
    });

    test.test('accepts four parameters', (test) => {
      let buildResponse = new StromboliBuildResponse();

      let data = new Buffer('bar');
      let map = new Buffer('map');
      let dependencies = ['foo'];

      buildResponse.addBinary('foo', data, map, dependencies);

      let binary = buildResponse.binaries[0];

      test.true(binary);
      test.same(binary.name, 'foo');
      test.equals(binary.data, data);
      test.equals(binary.map, map);
      test.equals(binary.dependencies, dependencies);

      test.end();
    });

    test.end();
  });

  test.test('addDependency', (test) => {
    let buildResponse = new StromboliBuildResponse();

    buildResponse.addDependency('foo');

    let dependency = buildResponse.dependencies[0];

    test.true(dependency);
    test.same(dependency, 'foo');

    test.end();
  });

  test.test('addError', (test) => {
    let buildResponse = new StromboliBuildResponse();

    buildResponse.addError('foo', 'bar');

    let error = buildResponse.errors[0];

    test.true(error);
    test.same(error.file, 'foo');
    test.same(error.message, 'bar');

    test.end();
  });

  test.end();
});