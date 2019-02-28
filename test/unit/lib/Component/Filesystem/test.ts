import {join, resolve} from 'path';

import {ComponentFilesystem, Source} from '../../../../../src';
import * as tape from 'tape';

tape('ComponentFilesystem', (test) => {
    test.test('constructor', (test) => {
        let path = 'foo';
        let component = new ComponentFilesystem(path);

        test.equals(component.path, path);

        test.end();
    });

    test.test('getSource', (test) => {
        let path = resolve('test/unit/lib/Component/Filesystem/fixtures');
        let component = new ComponentFilesystem(path);

        component.getSource('index.txt').then((source) => {
            test.looseEqual(source, new Source(join(path, 'index.txt'), Buffer.from('foo')));

            test.end();
        });

        test.test('should reject on error', (test) => {
            component.getSource('not_found.txt').then(
                () => {
                    test.fail('should throw an error');

                    test.end();
                },
                (err) => {
                    test.true(err);

                    test.end();
                }
            );
        });
    });

    test.end();
});