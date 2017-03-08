/*
 * logger-test.js: Tests for instances of the wilkins Logger
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var fs = require('fs'),
    path = require('path'),
    vows = require('vows'),
    http = require('http'),
    assert = require('assert'),
    wilkins = require('../lib/wilkins'),
    helpers = require('./helpers'),
    Console = require('../lib/transports/console').Console;

vows.describe('wilkins').addBatch({
  "The wilkins module": {
    topic: function () {
      wilkins.default.transports.console.level = 'silly';
      return null;
    },
    "should have the correct methods defined": function () {
      assert.isFunction(wilkins.Transport);
      assert.isObject(wilkins.default.transports.console);
      assert.isFalse(wilkins.emitErrs);
      assert.isObject(wilkins.config);
      ['Logger', 'add', 'remove', 'extend', 'clear']
        .concat(Object.keys(wilkins.config.npm.levels))
        .forEach(function (key) {
          assert.isFunction(wilkins[key]);
        });
    },
    "it should": {
      topic: function () {
        fs.readFile(path.join(__dirname, '..', 'package.json'), this.callback);
      },
      "have the correct version set": function (err, data) {
        assert.isNull(err);
        data = JSON.parse(data.toString());
        assert.equal(wilkins.version, data.version);
      }
    },
    "the log() method": helpers.testNpmLevels(wilkins, "should respond without an error", function (err) {
      assert.isNull(err);
    })
  }
}).addBatch({
  "The wilkins module": {
    "the setLevels() method": {
      topic: function () {
        wilkins.setLevels(wilkins.config.syslog.levels);
        return null;
      },
      "should have the proper methods defined": function () {
        assert.isFunction(Console);
        assert.isObject(wilkins.default.transports.console);
        assert.isFalse(wilkins.emitErrs);
        assert.isObject(wilkins.config);

        var newLevels = Object.keys(wilkins.config.syslog.levels);
        ['Logger', 'add', 'remove', 'extend', 'clear']
          .concat(newLevels)
          .forEach(function (key) {
            assert.isFunction(wilkins[key]);
          });


        Object.keys(wilkins.config.npm.levels)
          .filter(function (key) {
            return newLevels.indexOf(key) === -1;
          })
          .forEach(function (key) {
            assert.isTrue(typeof wilkins[key] === 'undefined');
          });
      }
    },
    "the clone() method": {
      "with Error object": {
        topic: function () {
          var original = new Error("foo");
          original.name = "bar";

          var copy = wilkins.clone(original);

          return { original: original, copy: copy };
        },
        "should clone the value": function (result) {
          assert.notEqual(result.original, result.copy);
          assert.equal(result.original.message, result.copy.message);
          assert.equal(result.original.name, result.copy.name);
        }
      },
      "with Date object": {
        topic: function () {
          var original = new Date(1000);

          var copy = wilkins.clone(original);

          return { original: original, copy: copy };
        },
        "should clone the value": function (result) {
          assert.notEqual(result.original, result.copy);
          assert.equal(result.original.getTime(), result.copy.getTime());
        }
      }
    }
  }
}).export(module);
