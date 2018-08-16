# Stromboli [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> The simple and efficient component builder

## Installation

```bash
npm install stromboli --save-dev
```

## Getting to know Stromboli

Stromboli is not opinionated.

## Basic usage

```
const {Stromboli, StromboliComponent, StromboliPlugin} = require('stromboli');

let components = [
  new StromboliComponent('bar', 'foo/bar')
];

let plugins = [
  new StromboliPlugin('foo_plugin', 'foo.entry', 'foo.output', [
    {
      process(buildRequest, buildResponse) {
        let file = path.join(buildRequest.component.path, buildRequest.plugin.entry);

        buildResponse.addDependency(file);
        buildResponse.addBinary(buildRequest.plugin.output, new Buffer('data'), new Buffer('map'));
      }
    }
  ])
];

let builder = new Stromboli();

builder.start(components, plugins).then(
  (buildResponses) => {
    for (let buildResponse of buildResponses) {
        console.log(buildResponse);
    }
  }
);
    
```

## API

### Binary

### BuildRequest

### BuildResponse

### Component

### Error

### Plugin

### ProcessorInterface

### Stromboli

* `buildComponent(component, plugins)`
* `buildComponentWithPlugin(component, plugin)`
* `start(components, plugins)`

## License

Apache-2.0 © [Eric MORAND]()

[npm-image]: https://badge.fury.io/js/stromboli.svg
[npm-url]: https://npmjs.org/package/stromboli
[travis-image]: https://travis-ci.org/ericmorand/stromboli.svg?branch=master
[travis-url]: https://travis-ci.org/ericmorand/stromboli
[coveralls-image]: https://coveralls.io/repos/github/ericmorand/stromboli/badge.svg
[coveralls-url]: https://coveralls.io/github/ericmorand/stromboli
