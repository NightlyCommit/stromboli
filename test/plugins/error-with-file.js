const path = require('path');
const Promise = require('promise');

class Plugin {
  constructor(config) {
    this.config = config || {};
  }

  render(file, output) {
    let renderResult = {
      dependencies: [
        'foo',
        'bar'
      ],
      error: {
        file: 'bar',
        message: 'Dummy error'
      }
    };

    return Promise.reject(renderResult);
  };
}

module.exports = Plugin;