/*
 * exception-test.js: Tests for exception data gathering in wilkins.
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

vows.describe('wilkins/exception').addBatch({
  "When using the wilkins exception module": {
    "the getProcessInfo() method": {
      topic: wilkins.exception.getProcessInfo(),
      "should respond with the appropriate data": function (info) {
        helpers.assertProcessInfo(info);
      }
    },
    "the getOsInfo() method": {
      topic: wilkins.exception.getOsInfo(),
      "should respond with the appropriate data": function (info) {
        helpers.assertOsInfo(info);
      }
    },
    "the getTrace() method": {
      topic: wilkins.exception.getTrace(new Error()),
      "should have the appropriate info": function (trace) {
        helpers.assertTrace(trace);
      }
    },
    "the getAllInfo() method": {
      topic: wilkins.exception.getAllInfo(new Error()),
      "should have the appropriate info": function (info) {
        assert.isObject(info);
        assert.isArray(info.stack);
        helpers.assertDateInfo(info.date);
        helpers.assertProcessInfo(info.process);
        helpers.assertOsInfo(info.os);
        helpers.assertTrace(info.trace);
      }
    }
  }
}).export(module);
