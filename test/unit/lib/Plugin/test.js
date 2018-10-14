const {Plugin} = require('../../../../build/cjs/lib/Plugin');
const tape = require('tape');

class FooProcessor {
  /**
   * @param {BuildRequest} buildRequest
   */
  process(buildRequest) {

  }
}

class BarProcessor {
  /**
   * @param {BuildRequest} buildRequest
   */
  process(buildRequest) {

  }
}

tape.test('Plugin', (test) => {
  test.test('constructor', (test) => {
    let processors = [
      new FooProcessor(),
      new BarProcessor()
    ];

    let component = new Plugin('foo', 'entry', 'output', processors);

    test.equals(component.name, 'foo');
    test.equals(component.entry, 'entry');
    test.equals(component.output, 'output');
    test.same(component.processors, processors);

    test.end();
  });

  test.end();
});