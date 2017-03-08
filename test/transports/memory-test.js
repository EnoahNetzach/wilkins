var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    wilkins = require('../../lib/wilkins'),
    helpers = require('../helpers'),
    Memory = require('../../lib/transports/memory').Memory;

var npmTransport = new Memory(),
    syslogTransport = new Memory({ levels: wilkins.config.syslog.levels });

vows.describe('wilkins/transports/memory').addBatch({
  "An instance of the Memory Transport": {
    "with npm levels": {
      "should have the proper methods defined": function () {
        helpers.assertMemory(npmTransport);
      },
      "the log() method": helpers.testNpmLevels(npmTransport, "should respond with true", function (ign, err, logged) {
        assert.isNull(err);
        assert.isTrue(logged);
      })
    },
    "with syslog levels": {
      "should have the proper methods defined": function () {
        helpers.assertMemory(syslogTransport);
      },
      "the log() method": helpers.testSyslogLevels(syslogTransport, "should respond with true", function (ign, err, logged) {
        assert.isNull(err);
        assert.isTrue(logged);
      })
    }
  }
}).export(module);
