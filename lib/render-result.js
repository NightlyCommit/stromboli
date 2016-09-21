class StromboliRenderResult {
  constructor() {
    this.sources = [];
    this.dependencies = new Set();
    this.binaries = [];
  };

  addSource(file, error = null) {
    this.sources.push({
      file: file,
      error: error
    });
  };

  addDependency(file) {
    if (!this.dependencies.has(file)) {
      this.dependencies.add(file);
    }
  };

  addBinary(name, data) {
    this.binaries.push({
      name: name,
      data: data
    });
  };

  getSources() {
    return this.sources;
  };

  getDependencies() {
    return this.dependencies;
  };

  getBinaries() {
    return this.binaries;
  }
}

module.exports = StromboliRenderResult;