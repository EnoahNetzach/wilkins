/*
 * common.js: Internal helper and utility functions for winston
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
// ### function longestElement
// #### @xs {Array} Array to calculate against
// Returns the longest element in the `xs` array.
//
module.exports = function (xs) {
  return Math.max.apply(
    null,
    xs.map(function (x) { return x.length; })
  );
};
