/*
 * default-exceptions.js: A test fixture for logging exceptions with the default wilkins logger.
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENCE
 *
 */
 
var path = require('path'),
    wilkins = require('../../../lib/wilkins'),
    File = require('../../../lib/transports/file').File;

wilkins.exitOnError = function (err) {
  return err.message !== 'Ignore this error';
};

wilkins.handleExceptions([
  new File({
    filename: path.join(__dirname, '..', 'logs', 'exit-on-error.log'),
    handleExceptions: true
  })
]);

setTimeout(function () {
  throw new Error('Ignore this error');
}, 1000);
