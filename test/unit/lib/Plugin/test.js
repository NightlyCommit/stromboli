const {StromboliPlugin} = require('../../../../build/lib/Plugin');
const tap = require('tap');

class FooProcessor {
  /**
   * @param {StromboliBuildRequest} request
   * @param {StromboliBuildResponse} response
   */
  process(request, response) {

  }
}

tap.test('Plugin', (test) => {
  test.test('constructor', (test) => {
    let processors = [
      new FooProcessor()
    ];

    let component = new StromboliPlugin('foo', 'entry', 'output', processors);

    test.equals(component.name, 'foo');
    test.equals(component.entry, 'entry');
    test.equals(component.output, 'output');
    test.same(component.processors, processors);

    test.end();
  });

  test.end();
});