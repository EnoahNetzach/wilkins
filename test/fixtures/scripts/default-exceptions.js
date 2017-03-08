/*
 * default-exceptions.js: A test fixture for logging exceptions with the default wilkins logger.
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENCE
 *
 */
 
var path = require('path'),
    wilkins = require('../../../lib/wilkins');

wilkins.handleExceptions([
  new (wilkins.transports.File)({
    filename: path.join(__dirname, '..', 'logs', 'default-exception.log'),
    handleExceptions: true
  })
]);

setTimeout(function () {
  throw new Error('OH NOES! It failed!');
}, 1000);
