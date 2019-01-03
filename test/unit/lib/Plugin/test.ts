import {BuildRequest, Plugin} from '../../../../src';
import * as tape from 'tape';

class FooProcessor {
    /**
     * @param {BuildRequest} buildRequest
     */
    process(buildRequest: BuildRequest) {
        return Promise.resolve();
    }
}

class BarProcessor {
    /**
     * @param {BuildRequest} buildRequest
     */
    process(buildRequest: BuildRequest) {
        return Promise.resolve();
    }
}

tape('Plugin', (test) => {
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