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

module.exports = function (str) {
  return str && str[0].toUpperCase() + str.slice(1);
};
