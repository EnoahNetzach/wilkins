/*
 * common.js: Internal helper and utility functions for wilkins
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

var util = require('util'),
  crypto = require('crypto'),
  cycle = require('cycle'),
  fs = require('fs'),
  StringDecoder = require('string_decoder').StringDecoder,
  Stream = require('stream').Stream,
  config = require('../config'),
  longestElement = require('./longestElement');

//
// ### function setLevels (target, past, current)
// #### @target {Object} Object on which to set levels.
// #### @past {Object} Previous levels set on target.
// #### @current {Object} Current levels to set on target.
// Create functions on the target objects for each level
// in current.levels. If past is defined, remove functions
// for each of those levels.
//
module.exports = function (target, past, current, isDefault) {
  var self = this;
  if (past) {
    Object.keys(past).forEach(function (level) {
      delete target[level];
    });
  }

  target.levels = current || config.npm.levels;
  if (target.padLevels) {
    target.levelLength = longestElement(Object.keys(target.levels));
  }

  //
  //  Define prototype methods for each log level
  //  e.g. target.log('info', msg) <=> target.info(msg)
  //
  Object.keys(target.levels).forEach(function (level) {

    // TODO Refactor logging methods into a different object to avoid name clashes
    if (level === 'log') {
      console.warn('Log level named "log" will clash with the method "log". Consider using a different name.');
      return;
    }

    target[level] = function (msg) {
      // build argument list (level, msg, ... [string interpolate], [{metadata}], [callback])
      var args = [level].concat(Array.prototype.slice.call(arguments));
      target.log.apply(target, args);
    };
  });

  return target;
};
