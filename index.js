'use strict';

const Component = require('./lib/component');
const RenderResult = require('./lib/render-result');

const fs = require('fs');
const log = require('log-util');
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
    this.logLevel = LOG_LEVEL_WARN;
  }

  /**
   *
   * @param config {Object}
   */
  start(config) {
    var that = this;
    var pkg = require('./package.json');

    that.setLogLevel(process.env.npm_config_loglevel);

    // fetch config
    config = merge.recursive({}, require('./defaults.js'), config);

    if (!Stromboli.checkConfig(config)) {
      throw 'Invalid config file passed as parameter';
    }

    that.debug('CONFIG', config);

    var projectDescription = pkg.name + ' - ' + pkg.version;

    log.info(('=').repeat(projectDescription.length));
    log.info(projectDescription);
    log.info(('=').repeat(projectDescription.length));

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

  static checkConfig(config) {
    if (!config) {
      return false;
    }

    return true;
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
    });
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

    var renderResult = new RenderResult();
    var entry = path.resolve(path.join(component.path, plugin.entry));

    var _renderDone = function (file, renderResult, err) {
      if (file) {
        renderResult.addSource(file, err);
      }

      if (err) {
        // we log the error for convenience
        if (err.message) {
          log.error(err.message);
        }
        else {
          log.error(err);
        }

        if (err.file) {
          renderResult.addDependency(err.file);
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
        return plugin.module.render(file, renderResult, plugin.output).then(
          function (renderResult) {
            return _renderDone(file, renderResult, null);
          },
          function (err) {
            return _renderDone(file, renderResult, err);
          }
        );
      },
      function () {
        return _renderDone(null, renderResult, null);
      }
    );
  };

  setLogLevel(logLevel) {
    this.logLevel = logLevels[logLevel];
  };

  warn() {
    if (this.logLevel >= LOG_LEVEL_WARN) {
      log.warn.apply(log, arguments);
    }
  };

  info() {
    if (this.logLevel >= LOG_LEVEL_INFO) {
      log.info.apply(log, arguments);
    }
  };

  debug() {
    if (this.logLevel >= LOG_LEVEL_VERBOSE) {
      log.debug.apply(log, arguments);
    }
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