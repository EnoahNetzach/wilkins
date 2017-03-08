/*
 * config.js: Default settings for all levels that wilkins knows about
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

var chalk = require('chalk');

// Fix colors not appearing in non-tty environments
chalk.enabled = true;

var config = exports,
    allColors = exports.allColors = {};

config.addColors = function (colors) {
  mixin(allColors, colors);
};

config.colorize = function (level, message) {
  if (typeof message === 'undefined') message = level;

  var colorized = message;
  if (allColors[level] instanceof Array) {
    for (var i = 0, l = allColors[level].length; i < l; ++i) {
      colorized = chalk[allColors[level][i]](colorized);
    }
  }
  else if (allColors[level].match(/\s/)) {
    var colorArr = allColors[level].split(/\s+/);
    for (var i = 0; i < colorArr.length; ++i) {
      colorized = chalk[colorArr[i]](colorized);
    }
    allColors[level] = colorArr;
  }
  else {
    colorized = chalk[allColors[level]](colorized);
  }

  return colorized;
};

//
// Export config sets
//
config.cli    = require('../config/cli-config');
config.npm    = require('../config/npm-config');
config.syslog = require('../config/syslog-config');

//
// Add colors for pre-defined config sets
//
config.addColors(config.cli.colors);
config.addColors(config.npm.colors);
config.addColors(config.syslog.colors);

function mixin (target) {
  var args = Array.prototype.slice.call(arguments, 1);

  args.forEach(function (a) {
    var keys = Object.keys(a);
    for (var i = 0; i < keys.length; i++) {
      target[keys[i]] = a[keys[i]];
    }
  });
  return target;
};
