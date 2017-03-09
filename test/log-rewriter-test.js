/*
 * log-rewriter-test.js: Tests for rewriting metadata in wilkins.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var assert = require('assert'),
    vows = require('vows'),
    wilkins = require('../src/wilkins'),
    helpers = require('./helpers'),
    Console = require('../src/transports/console').Console;

vows.describe('wilkins/logger/rewriter').addBatch({
  "An instance of wilkins.Logger": {
    topic: new (wilkins.Logger)({transports: [
      new Console({ level: 'info' })
    ]}),
    "the addRewriter() method": {
      topic: function (logger) {
        logger.rewriters.push(function (level, msg, meta) {
          meta.level = level;
          meta.msg = msg;
          meta.foo = 'bar';
          return meta;
        });

        return logger;
      },
      "should add the rewriter": function (logger) {
        assert.equal(helpers.size(logger.rewriters), 1);
      },
      "the log() method": {
        topic: function (logger) {
          logger.once('logging', this.callback);
          logger.log('info', 'test message', {"a": "b"});
        },
        "should run the rewriter": function (transport, level, msg, meta) {
          assert.equal(meta.a, 'b');
          assert.equal(meta.level, 'info');
          assert.equal(meta.msg, 'test message');
          assert.equal(meta.foo, 'bar');
        }
      }
    }
  }
}).addBatch({
  "An instance of wilkins.Logger with explicit rewriter": {
    topic: new (wilkins.Logger)({transports: [
      new Console({ level: 'info'})
    ], rewriters: [
      function (level, msg, meta) {
        meta.level = level;
        meta.msg = msg;
        meta.foo = 'bar';
        return meta;
      }
    ]}),
    "should add the rewriter": function (logger) {
      assert.equal(helpers.size(logger.rewriters), 1);
    },
    "the log() method": {
      topic: function (logger) {
        logger.once('logging', this.callback);
        logger.log('info', 'test message', {"a": "b"});
      },
      "should run the rewriter": function (transport, level, msg, meta) {
        assert.equal(meta.a, 'b');
        assert.equal(meta.level, 'info');
        assert.equal(meta.msg, 'test message');
        assert.equal(meta.foo, 'bar');
      }
    }
  }
}).addBatch({
  "An instance of wilkins.Logger with rewriters": {
    topic: new (wilkins.Logger)({transports: [
      new Console({ level: 'info' })
    ], rewriters: [
      function (level, msg, meta) {
        meta.numbers.push(1);
        return meta;
      },
      function (level, msg, meta) {
        meta.numbers.push(2);
        return meta;
      }
    ]}),
    "the log() method": {
      topic: function (logger) {
        logger.once('logging', this.callback);
        logger.log('info', 'test message', {"numbers": [0]});
      },
      "should run the rewriters in correct order": function (transport, level, msg, meta) {
        assert.deepEqual(meta.numbers, [0, 1, 2]);
      }
    }
  }
}).export(module);
