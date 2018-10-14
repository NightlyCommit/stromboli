# Stromboli [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> The simple yet efficient component builder

## Installation

```bash
npm install stromboli --save-dev
```

## Basic usage

```
const {Builder, Plugin, ComponentFilesystem} = require('stromboli');

let component = new ComponentFilesystem('bar');

let plugins = [
    new Plugin('foo_plugin', 'foo.entry', 'foo.output', [
        {
            process(buildRequest) {
                return buildRequest.component.getSource(buildRequest.plugin.entry).then(
                    (source) => {
                        buildRequest.addDependency(source.path);
                        buildRequest.addBinary(buildRequest.plugin.output, Buffer.from('binary data'), Buffer.from('source map'), ['a binary dependency', 'another binary dependency']);
                    }
                )
            }
        }
    ])
];

let builder = new Builder();

builder.buildComponent(component, plugins).then(
    (buildRequests) => {
        for (let [pluginName, buildRequest] of buildRequests) {
            console.log(buildRequest);
        }
    }
);

/**
 BuildRequest {
  component: ComponentFilesystem { path: 'bar' },
  plugin:
   Plugin {
     name: 'foo_plugin',
     entry: 'foo.entry',
     output: 'foo.output',
     processors: [ [Object] ] },
  binaries:
   [ Binary {
       name: 'foo.output',
       data: <Buffer 62 69 6e 61 72 79 20 64 61 74 61>,
       map: <Buffer 73 6f 75 72 63 65 20 6d 61 70>,
       dependencies: [Array] } ],
  dependencies: [ 'bar/foo.entry' ],
  errors: [] }
*/
    
```

## API

### Binary

### Builder

* `buildComponent(component: ComponentInterface, plugins: Plugin[])`
* `buildComponentWithPlugin(component: ComponentInterface, plugin: plugin)`

### BuildRequest

### ComponentFilesystem

### ComponentInterface

### Error

### Plugin

### ProcessorInterface

### Source

## License

Apache-2.0 © [Eric MORAND]()

[npm-image]: https://badge.fury.io/js/stromboli.svg
[npm-url]: https://npmjs.org/package/stromboli
[travis-image]: https://travis-ci.org/ericmorand/stromboli.svg?branch=master
[travis-url]: https://travis-ci.org/ericmorand/stromboli
[coveralls-image]: https://coveralls.io/repos/github/ericmorand/stromboli/badge.svg
[coveralls-url]: https://coveralls.io/github/ericmorand/stromboli
