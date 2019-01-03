const lib = require('../../../build/cjs/index');

import * as tape from 'tape';

tape('lib', function (test) {
    let expected = [
        'Binary',
        'Builder',
        'ComponentFilesystem',
        'BuildRequest',
        'Error',
        'Plugin',
        'Source'
    ];

    for (let key of expected) {
        test.true(lib[key], `${key} is exported`);
    }

    for (let key in lib) {
        test.true(expected.includes(key), `${key} is legit`);
    }

    test.end();
});