const {BuildRequest} = require('../../../../build/cjs/lib/BuildRequest');
const {ComponentFilesystem, Plugin,Binary} = require('../../../../build/cjs');

const tape = require('tape');

tape.test('BuildRequest', (test) => {
  let component = new ComponentFilesystem('foo');
  let plugin = new Plugin('foo', 'bar', 'output', []);

  test.test('constructor', (test) => {
    let buildRequest = new BuildRequest(component, plugin);

    test.same(buildRequest.component, component);
    test.same(buildRequest.plugin, plugin);

    test.end();
  });

  test.test('addBinary', (test) => {
    test.test('accept 2 parameters', (test) => {
      let buildRequest = new BuildRequest(component, plugin);

      buildRequest.addBinary('foo', Buffer.from('bar'));

      test.looseEqual(buildRequest.binaries[0], new Binary('foo', Buffer.from('bar')));

      test.end();
    });

    test.test('accept 3 parameters', (test) => {
      let buildRequest = new BuildRequest(component, plugin);

      buildRequest.addBinary('foo', Buffer.from('bar'), Buffer.from('map'));

      test.looseEqual(buildRequest.binaries[0], new Binary('foo', Buffer.from('bar'), Buffer.from('map')));

      test.end();
    });

    test.test('accept 4 parameters', (test) => {
      let buildRequest = new BuildRequest(component, plugin);

      buildRequest.addBinary('foo', Buffer.from('bar'), Buffer.from('map'), ['dep']);

      test.looseEqual(buildRequest.binaries[0], new Binary('foo', Buffer.from('bar'), Buffer.from('map'), ['dep']));

      test.end();
    });
  });

  test.end();
});