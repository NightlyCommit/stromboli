import * as sinon from 'sinon';

import {
    Binary,
    Builder,
    BuildRequest,
    ComponentInterface,
    Error as StromboliError,
    Plugin,
    ProcessorInterface,
    Source
} from '../../../../src';
import * as tape from 'tape';

class FooProcessor {
    /**
     * @param {BuildRequest} buildRequest
     * @return {Promise<void>}
     */
    process(buildRequest: BuildRequest) {
        buildRequest.addBinary(new Binary('bin1', new Buffer('bin1data')));
        buildRequest.addBinary(new Binary('bin2', new Buffer('bin2data'), new Buffer('bin2map')));

        buildRequest.addDependency(new Source('dep1', 'dep1data'));
        buildRequest.addDependency(new Source('dep2', 'dep2data'));
        buildRequest.addDependency(new Source('dep3', 'dep3data'));

        return Promise.resolve();
    }
}

class BarProcessor {
    /**
     * @param {BuildRequest} buildRequest
     * @return {Promise<void>}
     */
    process(buildRequest: BuildRequest) {
        return Promise.resolve();
    }
}

class ErrorProcessor implements ProcessorInterface {
    /**
     * @param {BuildRequest} buildRequest
     * @return {Promise<void>}
     */
    process(buildRequest: BuildRequest) {
        return buildRequest.source.then(
            (source) => {
                buildRequest.addBinary(new Binary('bin1', new Buffer('bin1data')));

                buildRequest.addDependency(new Source('dep1', 'dep1data'));

                buildRequest.addError(new StromboliError('err1message', source, 1));
            }
        );
    }
}

class ErrorProcessor2 {
    /**
     * @param {BuildRequest} buildRequest
     * @return {Promise<void>}
     */
    process(buildRequest: BuildRequest) {
        return buildRequest.source.then(
            (source) => {
                buildRequest.addError(new StromboliError('err2message', source, 1));
            }
        );
    }
}

class CustomComponent implements ComponentInterface {
    getSource(entry: string): Promise<Source> {
        return Promise.resolve(new Source('foo', 'bar'));
    }
}

tape('Builder', (test) => {
    test.test('constructor', (test) => {
        let stromboli = new Builder();

        test.true(stromboli);

        test.end();
    });

    test.test('buildComponentWithPlugin', (test) => {
        let stromboli = new Builder();

        let component = new CustomComponent();
        let plugin = new Plugin('plugin1', 'foo.entry', 'foo.output', [
            new FooProcessor(),
            new ErrorProcessor(),
            new ErrorProcessor2()
        ]);

        stromboli.buildComponentWithPlugin(component, plugin).then(
            (result) => {
                test.equals(result.binaries.length, 2, 'binaries should be set and deduped');
                test.equals(result.binaries[0].name, 'bin2', 'binaries should be ordered');
                test.equals(result.binaries[1].name, 'bin1', 'binaries should be ordered');
                test.equals(result.dependencies.length, 3, 'dependencies should be set and deduped');
                test.equals(result.errors.length, 2, 'errors should be set');
                test.equals(result.errors[0].message, 'err1message', 'errors should be ordered');
                test.equals(result.errors[1].message, 'err2message', 'errors should be ordered');

                test.end();
            }
        );

        test.test('processors are run sequentially', (test) => {
            let fooProcessor = new FooProcessor();
            let barProcessor = new BarProcessor();

            let value: string = null;
            let flag = false;

            sinon.stub(fooProcessor, 'process').callsFake(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        value = 'foo';

                        resolve();
                    }, 100);
                });
            });

            sinon.stub(barProcessor, 'process').callsFake(() => {
                flag = (value === 'foo');

                return Promise.resolve();
            });

            let plugin = new Plugin('plugin1', 'foo.entry', 'foo.output', [
                fooProcessor,
                barProcessor
            ]);

            stromboli.buildComponentWithPlugin(component, plugin).then(
                () => {
                    test.true(flag);

                    test.end();
                }
            );
        });

        test.test('this is defined inside "process" function', (test) => {
            let fooProcessor = new FooProcessor();

            let flag: boolean = null;

            sinon.stub(fooProcessor, 'process').callsFake(function () {
                return new Promise((resolve) => {
                    flag = (this === fooProcessor);

                    resolve();
                });
            });

            let plugin = new Plugin('plugin1', 'foo.entry', 'foo.output', [
                fooProcessor
            ]);

            stromboli.buildComponentWithPlugin(component, plugin).then(
                () => {
                    test.true(flag);

                    test.end();
                }
            );
        });
    });

    test.test('buildComponent', (test) => {
        let builder = new Builder();
        let component = new CustomComponent();

        let plugins = [
            new Plugin('plugin1', 'foo.entry1', 'foo.output1', [
                new FooProcessor()
            ]),
            new Plugin('plugin2', 'foo.entry2', 'foo.output2', [
                new ErrorProcessor()
            ])
        ];

        builder.buildComponent(component, plugins).then(
            (results) => {
                test.true(results.has('plugin1'));
                test.true(results.has('plugin2'));

                test.end();
            }
        );
    });

    test.end();
});