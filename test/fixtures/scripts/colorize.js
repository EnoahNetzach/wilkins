/*
 * colorize.js: A test fixture for logging colorized messages
 *
 * (C) 2015 Tom Spencer
 * MIT LICENCE
 *
 */

var wilkins = require('../../../lib/wilkins');

var logger = new (wilkins.Logger)({
    transports: [
      new wilkins.transports.Console({ colorize: process.argv[2] === 'true' })
    ]
  });
logger.info('Simply a test');
