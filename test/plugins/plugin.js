const path = require('path');
const Promise = require('promise');

class Plugin {
  constructor(config) {
    this.config = config || {};
  }

  render(file, renderResult, output) {
    var ext = path.extname(file);

    if (!output) {
      output = 'index' + ext + '.bin';
    }

    renderResult.addBinary(output, 'data');
    renderResult.addDependency(file);
    renderResult.addDependency(path.resolve('test/build/single/index' + ext + '.dep'));

    return Promise.resolve(renderResult);
  };
}

module.exports = Plugin;