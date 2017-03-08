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
  config = require('../config');

//
// ### function pad (n)
// Returns a padded string if `n < 10`.
//
module.exports = function (n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
};
