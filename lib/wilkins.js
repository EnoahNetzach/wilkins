/*
 * wilkins.js: Top-level include defining Wilkins.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

var wilkins = exports;

//
// use require method for webpack bundle
//
wilkins.version = require('../package.json').version;

//
// Include transports defined by default by wilkins
//
const Console = require('./transports/console').Console;

//
// Expose utility methods
//
const setLevels             = require('./common/setLevels');
wilkins.hash           = require('./common/hash');
wilkins.clone          = require('./common/clone');
wilkins.longestElement = require('./common/longestElement');
wilkins.exception      = require('./exception');
wilkins.config         = require('./config');
wilkins.addColors      = wilkins.config.addColors;

//
// Expose core Logging-related prototypes.
//
wilkins.Container      = require('./container').Container;
wilkins.Logger         = require('./logger').Logger;
wilkins.Transport      = require('./transports/transport').Transport;

//
// We create and expose a default `Container` to `wilkins.loggers` so that the
// programmer may manage multiple `wilkins.Logger` instances without any additional overhead.
//
// ### some-file1.js
//
//     var logger = require('wilkins').loggers.get('something');
//
// ### some-file2.js
//
//     var logger = require('wilkins').loggers.get('something');
//
wilkins.loggers = new wilkins.Container();

//
// We create and expose a 'defaultLogger' so that the programmer may do the
// following without the need to create an instance of wilkins.Logger directly:
//
//     var wilkins = require('wilkins');
//     wilkins.log('info', 'some message');
//     wilkins.error('some error');
//
const defaultLogger = new wilkins.Logger({
  transports: [new Console()]
});

//
// Pass through the target methods onto `wilkins`.
//
const methods = [
  'log',
  'query',
  'stream',
  'add',
  'remove',
  'clear',
  'profile',
  'startTimer',
  'extend',
  'cli',
  'handleExceptions',
  'unhandleExceptions',
  'configure'
];
setLevels(wilkins, null, defaultLogger.levels);
methods.forEach(function (method) {
  wilkins[method] = function () {
    return defaultLogger[method].apply(defaultLogger, arguments);
  };
});

//
// ### function cli ()
// Configures the default wilkins logger to have the
// settings for command-line interfaces: no timestamp,
// colors enabled, padded output, and additional levels.
//
wilkins.cli = function () {
  wilkins.padLevels = true;
  setLevels(wilkins, defaultLogger.levels, wilkins.config.cli.levels);
  defaultLogger.setLevels(wilkins.config.cli.levels);
  wilkins.config.addColors(wilkins.config.cli.colors);

  if (defaultLogger.transports.console) {
    defaultLogger.transports.console.colorize = true;
    defaultLogger.transports.console.timestamp = false;
  }

  return wilkins;
};

//
// ### function setLevels (target)
// #### @target {Object} Target levels to use
// Sets the `target` levels specified on the default wilkins logger.
//
wilkins.setLevels = function (target) {
  setLevels(wilkins, defaultLogger.levels, target);
  defaultLogger.setLevels(target);
};

//
// Define getter / setter for the default logger level
// which need to be exposed by wilkins.
//
Object.defineProperty(wilkins, 'level', {
  get: function () {
    return defaultLogger.level;
  },
  set: function (val) {
    defaultLogger.level = val;

    Object.keys(defaultLogger.transports).forEach(function(key) {
      defaultLogger.transports[key].level = val;
    });
  }
});

//
// Define getters / setters for appropriate properties of the
// default logger which need to be exposed by wilkins.
//
['emitErrs', 'exitOnError', 'padLevels', 'levelLength', 'stripColors'].forEach(function (prop) {
  Object.defineProperty(wilkins, prop, {
    get: function () {
      return defaultLogger[prop];
    },
    set: function (val) {
      defaultLogger[prop] = val;
    }
  });
});

//
// @default {Object}
// The default transports and exceptionHandlers for
// the default wilkins logger.
//
Object.defineProperty(wilkins, 'default', {
  get: function () {
    return {
      transports: defaultLogger.transports,
      exceptionHandlers: defaultLogger.exceptionHandlers
    };
  }
});
