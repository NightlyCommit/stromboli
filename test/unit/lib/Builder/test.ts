import * as sinon from 'sinon';

import {Builder, BuildRequest, ComponentFilesystem, Plugin, ProcessorInterface} from '../../../../src';
import * as tape from 'tape';

class FooProcessor {
    /**
     * @param {BuildRequest} buildRequest
     * @return {Promise<void>}
     */
    process(buildRequest: BuildRequest) {
        buildRequest.addBinary('bin1', new Buffer('bin1data'));
        buildRequest.addBinary('bin2', new Buffer('bin2data'), new Buffer('bin2map'));

        buildRequest.addDependency('dep1');
        buildRequest.addDependency('dep2');
        buildRequest.addDependency('dep3');

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
        buildRequest.addBinary('bin1', new Buffer('bin1data'));

        buildRequest.addDependency('dep1');

        buildRequest.addError('err1file', 'err1message');

        return Promise.resolve();
    }
}

class ErrorProcessor2 {
    /**
     * @param {BuildRequest} buildRequest
     * @return {Promise<void>}
     */
    process(buildRequest: BuildRequest) {
        buildRequest.addError('err2file', 'err2message');

        return Promise.resolve();
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

        let component = new ComponentFilesystem('foo');
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
                test.equals(result.errors[0].file, 'err1file', 'errors should be ordered');
                test.equals(result.errors[1].file, 'err2file', 'errors should be ordered');

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
        let component = new ComponentFilesystem('/foo');

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