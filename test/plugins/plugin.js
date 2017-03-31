const path = require('path');
const Promise = require('promise');

class Plugin {
  constructor(config) {
    this.config = config || {};
  }

  render(file, output) {
    var ext = path.extname(file);

    if (!output) {
      output = 'index' + ext + '.bin';
    }

    return Promise.resolve({
      binaries: [
        {
          name: output,
          data: 'data'
        }
      ],
      sourceDependencies: [
        file,
        file, // we force duplicate dependency to ensure that Stromboli deduplicate them
        path.resolve('test/build/single/index' + ext + '.dep.src')
      ],
      binaryDependencies: [
        path.resolve('test/build/single/index' + ext + '.dep.bin'),
        path.resolve('test/build/single/index' + ext + '.dep.bin') // we force duplicate dependency to ensure that Stromboli deduplicate them
      ]
    });
  };
}

module.exports = Plugin;