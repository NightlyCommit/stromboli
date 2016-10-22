const path = require('path');
const Promise = require('promise');

class Plugin {
  constructor(config)  {
    this.config = config || {};
  }

  render(file, renderResult) {
    var ext = path.extname(file);

    renderResult.addBinary('index' + ext + '.bin', 'data');
    renderResult.addDependency(file);
    renderResult.addDependency(path.resolve('test/build/single/index' + ext + '.dep'));

    return Promise.resolve(renderResult);
  };
}

module.exports = Plugin;