const Stromboli = require('../src');
const tap = require('tap');
const fs = require('fs');
const sinon = require('sinon');

const Plugin = require('./plugins/plugin');

tap.test('loglevel', function (test) {
  let stromboli = new Stromboli();

  test.beforeEach(function(done) {
    sinon.stub(stromboli.logger, 'warn');
    sinon.stub(stromboli.logger, 'info');
    sinon.stub(stromboli.logger, 'debug');

    done();
  });

  test.afterEach(function(done) {
    stromboli.logger.warn.restore();
    stromboli.logger.info.restore();
    stromboli.logger.debug.restore();

    done();
  });

  let plugins = {
    first: {
      entry: 'index.1',
      module: Plugin
    }
  };

  let config = {
    componentRoot: 'test/start',
    plugins: plugins
  };

  test.plan(4);

  let loglevelTest = function (loglevel, warnCount, infoCount, debugCount) {
    return function (subtest) {
      stromboli.setLogLevel(loglevel);

      return stromboli.start(config).then(
        function () {
          subtest.equal(stromboli.logger.warn.callCount, warnCount);
          subtest.equal(stromboli.logger.info.callCount, infoCount);
          subtest.equal(stromboli.logger.debug.callCount, debugCount);
        }
      );
    }
  };

  test.test('silent', loglevelTest('silent', 0, 0, 0));
  test.test('warn', loglevelTest('warn', 3, 0, 0));
  test.test('info', loglevelTest('info', 3, 7, 0));
  test.test('verbose', loglevelTest('verbose', 3, 7, 4));
});