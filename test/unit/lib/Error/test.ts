import {Error} from '../../../../src';
import * as tape from 'tape';

tape('Error', (test) => {
    test.test('constructor', (test) => {
        let error = new Error('foo', 'bar');

        test.equals(error.file, 'foo');
        test.equals(error.message, 'bar');

        test.end();
    });

    test.end();
});