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
// ### function stringArrayToSet (array)
// #### @strArray {Array} Array of Set-elements as strings.
// #### @errMsg {string} **Optional** Custom error message thrown on invalid input.
// Returns a Set-like object with strArray's elements as keys (each with the value true).
//
module.exports = function (strArray, errMsg) {
  if (typeof errMsg === 'undefined') {
    errMsg = 'Cannot make set from Array with non-string elements';
  }
  return strArray.reduce(function (set, el) {
    if (!(typeof el === 'string' || el instanceof String)) {
      throw new Error(errMsg);
    }
    set[el] = true;
    return set;
  }, Object.create(null));
};
