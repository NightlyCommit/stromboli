const path = require('path');
const Promise = require('promise');

class Plugin {
  constructor(config) {
    this.config = config || {};
  }

  render(file, output) {
    return Promise.reject({
      file: 'dummy',
      message: 'Dummy error'
    });
  };
}

module.exports = Plugin;