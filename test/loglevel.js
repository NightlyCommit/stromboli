const Stromboli = require('../src');
const tap = require('tap');
const fs = require('fs');
const sinon = require('sinon');

const Plugin = require('./plugins/plugin');

class Builder extends Stromboli {
  start(config) {
    let self = this;

    return super.start(config).then(
      function() {
        self.warn('Done');
      }
    );
  }
}

tap.test('loglevel', function (test) {
  let stromboli = new Builder();

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
  test.test('warn', loglevelTest('warn', 1, 0, 0));
  test.test('info', loglevelTest('info', 1, 7, 0));
  test.test('verbose', loglevelTest('verbose', 1, 7, 4));
});