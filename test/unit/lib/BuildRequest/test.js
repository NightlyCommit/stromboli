const {BuildRequest} = require('../../../../build/cjs/lib/BuildRequest');
const {ComponentFilesystem, Plugin, Binary} = require('../../../../build/cjs');

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

  test.test('entry', (test) => {
    test.test('handle string', (test) => {
      let plugin = new Plugin('foo', 'entry', 'output', []);

      let buildRequest = new BuildRequest(component, plugin);

      test.same(buildRequest.entry, 'entry');

      test.end();
    });

    test.test('handle function', (test) => {
      let plugin = new Plugin('foo', (component) => {
        return component.path;
      }, 'output', []);

      let buildRequest = new BuildRequest(component, plugin);

      test.same(buildRequest.entry, 'foo');

      test.end();
    });

    test.end();
  });

  test.test('output', (test) => {
    test.test('handle string', (test) => {
      let plugin = new Plugin('foo', 'entry', 'output', []);

      let buildRequest = new BuildRequest(component, plugin);

      test.same(buildRequest.output, 'output');

      test.end();
    });

    test.test('handle function', (test) => {
      let plugin = new Plugin('foo', 'entry', (component) => {
        return component.path;
      }, []);

      let buildRequest = new BuildRequest(component, plugin);

      test.same(buildRequest.output, 'foo');

      test.end();
    });

    test.end();
  });

  test.end();
});