import {Source} from '../../../../src';
import * as tape from 'tape';

tape('Source', (test) => {
    test.test('constructor', (test) => {
        let source = new Source('foo', Buffer.from('bar'));

        test.looseEqual(source.name, 'foo');
        test.looseEqual(source.data, Buffer.from('bar'));

        test.end();
    });

    test.end();
});