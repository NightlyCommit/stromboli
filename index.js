'use strict';

const Component = require('./lib/component');

const fs = require('fs');
const merge = require('merge');
const path = require('path');
const finder = require('fs-finder');

// promise support
const Promise = require('promise');
const fsStat = Promise.denodeify(fs.stat);

// log support
const LOG_LEVEL_SILENT = 0;
const LOG_LEVEL_ERROR = 1;
const LOG_LEVEL_WARN = 2;
const LOG_LEVEL_HTTP = 3;
const LOG_LEVEL_INFO = 4;
const LOG_LEVEL_VERBOSE = 5;
const LOG_LEVEL_SILLY = 6;

const logLevels = {
  'silent': LOG_LEVEL_SILENT,
  'error': LOG_LEVEL_ERROR,
  'warn': LOG_LEVEL_WARN,
  'http': LOG_LEVEL_HTTP,
  'info': LOG_LEVEL_INFO,
  'verbose': LOG_LEVEL_VERBOSE,
  'silly': LOG_LEVEL_SILLY
};

class Stromboli {
  constructor() {
    this.setLogLevel(process.env.npm_config_loglevel);
    this.logger = require('log-util');
  }

  /**
   *
   * @param config {Object}
   */
  start(config) {
    var that = this;
    var pkg = require('./package.json');

    // fetch config
    config = merge.recursive({}, require('./defaults.js'), config);

    that.debug('CONFIG', config);

    var projectDescription = pkg.name + ' - ' + pkg.version;

    this.warn(('=').repeat(projectDescription.length));
    this.warn(projectDescription);
    this.warn(('=').repeat(projectDescription.length));

    var plugins = null;
    var components = null;

    return Promise.all([
      that.getPlugins(config).then(
        function (results) {
          plugins = results;
        }
      ),
      that.getComponents(config.componentRoot, config.componentManifest).then(
        function (results) {
          components = results;
        }
      )
    ]).then(
      function () {
        return Promise.all(components.map(function (component) {
          return that.buildComponent(component, plugins).then(
            function (component) {
              return component;
            }
          );
        })).then(
          function (components) {
            that.info('<', components.length, 'COMPONENTS RENDERED');

            return Array.prototype.concat.apply([], components);
          }
        );
      }
    );
  };

  getPlugins(config) {
    var that = this;

    that.info('> FETCHING PLUGINS');

    return Promise.all(Object.keys(config.plugins).map(function (key) {
      var plugin = config.plugins[key];
      var pluginModule = plugin.module;

      return {
        name: key,
        entry: plugin.entry,
        output: plugin.output,
        module: new pluginModule(plugin.config)
      };
    })).then(
      function (plugins) {
        that.info('<', plugins.length, 'PLUGINS FETCHED');
        that.debug(plugins);

        return plugins;
      }
    )
  };

  getComponents(directory, componentManifest) {
    var that = this;

    that.info('> FETCHING COMPONENTS');

    return new Promise(function (fulfill, reject) {
      finder.from(directory).findFiles(componentManifest, function (files) {
          var components = [];

          files.forEach(function (file) {
            var manifest = require(file);
            var component = new Component(manifest.name, path.dirname(file));

            components.push(component);
          });

          fulfill(components);
        }
      );
    }).then(
      function(components) {
        that.info('<', components.length, 'COMPONENTS FETCHED');
        that.debug(components);

        return components;
      }
    );
  };

  buildComponent(component, plugins) {
    var that = this;

    return Promise.all(plugins.map(function (plugin) {
      return that.pluginRenderComponent(plugin, component);
    })).then(function () {
      return component;
    });
  };

  pluginRenderComponent(plugin, component) {
    var that = this;
    var beginDate = new Date();

    that.info('> COMPONENT', component.name, 'IS ABOUT TO BE RENDERED BY PLUGIN', plugin.name);

    var entry = path.resolve(path.join(component.path, plugin.entry));

    var _renderDone = function (file, pluginRenderResult) {
      let renderResult = {
        source: null,
        dependencies: new Set(),
        binaries: [],
        error: null
      };

      // source
      renderResult.source = file;

      // error
      if (pluginRenderResult && pluginRenderResult.error) {
        renderResult.error = pluginRenderResult.error;
      }

      // dependencies
      let addDependency = function(dependency) {
        if (!renderResult.dependencies.has(dependency)) {
          renderResult.dependencies.add(dependency);
        }
      };

      if (pluginRenderResult && pluginRenderResult.dependencies) {
        pluginRenderResult.dependencies.forEach(function(dependency) {
          addDependency(dependency);
        });
      }

      // binaries
      if (pluginRenderResult && pluginRenderResult.binaries) {
        pluginRenderResult.binaries.forEach(function(binary) {
          renderResult.binaries.push(binary);
        });
      }

      let err = renderResult.error;

      if (err) {
        // we log the error for convenience
        if (err.message) {
          that.error(err.message);
        }
        else {
          that.error(err);
        }
      }

      component.renderResults.set(plugin.name, renderResult);

      var endDate = new Date();

      that.info('< COMPONENT', component.name, 'HAS BEEN RENDERED BY PLUGIN', plugin.name, 'IN', endDate - beginDate + 'MS');
      that.debug(component);

      return component;
    };

    return that.exists(entry).then(
      function (file) {
        return plugin.module.render(file, plugin.output).then(
          function (renderResult) {
            return _renderDone(file, renderResult);
          },
          function (renderResult) {
            return _renderDone(file, renderResult);
          }
        );
      },
      function () {
        return _renderDone(null, null);
      }
    );
  };

  setLogLevel(logLevel) {
    this.logLevel = logLevels[logLevel];
  };

  warn() {
    if (this.logLevel >= LOG_LEVEL_WARN) {
      this.logger.warn.apply(this.logger, arguments);
    }
  };

  info() {
    if (this.logLevel >= LOG_LEVEL_INFO) {
      this.logger.info.apply(this.logger, arguments);
    }
  };

  debug() {
    if (this.logLevel >= LOG_LEVEL_VERBOSE) {
      this.logger.debug.apply(this.logger, arguments);
    }
  };

  error() {
    this.logger.error.apply(this.logger, arguments);
  };

  /**
   *
   * @param path {String}
   * @returns {Promise}
   */
  exists(path) {
    return fsStat(path).then(
      function () {
        return path;
      },
      function (e) {
        return Promise.reject(e);
      }
    )
  };
}

module.exports = Stromboli;