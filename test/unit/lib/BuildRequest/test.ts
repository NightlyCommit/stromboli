import {Binary, BuildRequest, ComponentFilesystem, ComponentInterface, Plugin, Source} from '../../../../src';

import * as tape from 'tape';

tape('BuildRequest', (test) => {
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
            let plugin = new Plugin('foo', (component: ComponentFilesystem) => {
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
            let plugin = new Plugin('foo', 'entry', (component: ComponentFilesystem) => {
                return component.path;
            }, []);

            let buildRequest = new BuildRequest(component, plugin);

            test.same(buildRequest.output, 'foo');

            test.end();
        });

        test.end();
    });

    test.test('source', (test) => {
        class CustomComponent implements ComponentInterface {
            getSource(entry: string): Promise<Source> {
                return Promise.resolve(new Source(Buffer.from('foo'), 'bar/' + entry));
            }
        }

        let plugin = new Plugin('foo', 'entry', 'output', []);
        let buildRequest = new BuildRequest(new CustomComponent(), plugin);

        buildRequest.source.then(
            (source) => {
                test.same(source.code.toString(), 'foo');
                test.same(source.path, 'bar/entry');

                test.end();
            }
        );
    });

    test.end();
});