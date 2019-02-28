import {Error, Source} from '../../../../src';
import * as tape from 'tape';

tape('Error', (test) => {
    test.test('constructor', (test) => {
        let source = new Source('foo', 'bar');
        let location = [1, 2];
        let error = new Error('bar', source, location);

        test.equals(error.source, source);
        test.equals(error.message, 'bar');
        test.equals(error.location, location);

        test.end();
    });

    test.end();
});