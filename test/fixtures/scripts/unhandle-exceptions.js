/*
 * unhandle-exceptions.js: A test fixture for using `.unhandleExceptions()` wilkins.
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENCE
 *
 */
 
var path = require('path'),
    wilkins = require('../../../src/wilkins'),
    File = require('../../../src/transports/file').File;

var logger = new (wilkins.Logger)({
  transports: [
    new File({
      filename: path.join(__dirname, '..', 'logs', 'unhandle-exception.log'),
      handleExceptions: true
    })
  ]
});

logger.handleExceptions();
logger.unhandleExceptions();

setTimeout(function () {
  throw new Error('OH NOES! It failed!');
}, 1000);
