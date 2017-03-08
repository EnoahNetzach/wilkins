/*
 * cli-test.js: Tests for the cli levels available in wilkins.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    wilkins = require('../lib/wilkins'),
    helpers = require('./helpers');

vows.describe('wilkins/logger/cli').addBatch({
  "When an instance of wilkins.transports.Console()": {
    "has colorize true": {
      topic: function () {
        var transport = new wilkins.transports.Console({ colorize: true });
        transport.log('prompt', 'This had better work.', { test: true }, this.callback);
      },
      "should function without error": function (err, ok) {
        assert.isNull(err);
        assert.isTrue(ok);
      }
    }
  },
  "When an instance of wilkins.Logger": {
    topic: function () {
      return new wilkins.Logger({
        transports: [
          new wilkins.transports.Console()
        ]
      })
    },
    "the cli() method": {
      "should set the appropriate values on the logger": function (logger) {
        logger.cli();
        assert.isTrue(logger.padLevels);
        assert.isTrue(logger.transports.console.colorize);
        assert.isFalse(logger.transports.console.timestamp);
        Object.keys(wilkins.config.cli.levels).forEach(function (level) {
          assert.isNumber(logger.levels[level]);
        });

        Object.keys(wilkins.config.cli.colors).forEach(function (color) {
          assert.isString(wilkins.config.allColors[color]);
        });
      }
    }
  }
}).export(module);
