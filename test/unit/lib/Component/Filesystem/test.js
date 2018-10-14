const {ComponentFilesystem} = require('../../../../../build/cjs/lib/Component/Filesystem');
const {Source} = require('../../../../../build/cjs');
const tape = require('tape');
const {resolve, join} = require('path');


tape.test('ComponentFilesystem', (test) => {
  test.test('constructor', (test) => {
    let path = 'foo';
    let component = new ComponentFilesystem(path);

    test.equals(component.path, path);

    test.end();
  });

  test.test('getSource', (test) => {
    let path = resolve('test/unit/lib/Component/Filesystem/fixtures');
    let component = new ComponentFilesystem(path);

    component.getSource('index.txt').then((source) => {
      test.looseEqual(source, new Source(Buffer.from('foo'), join(path, 'index.txt')));

      test.end();
    });

    test.test('should reject on error', (test) => {
      component.getSource('not_found.txt').then(
        () => {
          test.fail('should throw an error');

          test.end();
        },
        (err) => {
          test.true(err);

          test.end();
        }
      );
    });
  });

  test.end();
});