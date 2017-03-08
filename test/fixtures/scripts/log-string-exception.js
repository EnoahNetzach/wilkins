/*
 * log-string-exceptions.js: A test fixture for logging string exceptions in wilkins.
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENCE
 *
 */

var path = require('path'),
    wilkins = require('../../../lib/wilkins');

var logger = new (wilkins.Logger)({
  transports: [
    new (wilkins.transports.File)({
      filename: path.join(__dirname, '..', 'logs', 'string-exception.log'),
      handleExceptions: true
    })
  ]
});

logger.handleExceptions();

setTimeout(function () {
  throw 'OMG NEVER DO THIS STRING EXCEPTIONS ARE AWFUL';
}, 1000);
