import {Source} from '../../../../src';
import * as tape from 'tape';

tape('Source', (test) => {
    test.test('constructor', (test) => {
        let source = new Source(Buffer.from('foo'), 'path');

        test.test('accept 1 parameter', (test) => {
            let source = new Source(Buffer.from('foo'));

            test.looseEqual(source.code, Buffer.from('foo'));
            test.looseEqual(source.path, '');

            test.end();
        });

        test.test('accept 2 parameters', (test) => {
            let source = new Source(Buffer.from('foo'), 'bar');

            test.looseEqual(source.code, Buffer.from('foo'));
            test.looseEqual(source.path, 'bar');

            test.end();
        });

        test.end();
    });

    test.end();
});