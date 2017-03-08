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
// ### function timestamp ()
// Returns a timestamp string for the current time.
//
module.exports = function () {
  return new Date().toISOString();
};
