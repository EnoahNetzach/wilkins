var wilkins = require('../lib/wilkins');

var logger = module.exports = new (wilkins.Logger)({
  transports: [
    new (wilkins.transports.Console)({
      colorize: 'all'
    })
  ]
});

logger.log('info', 'This is an information message.');
