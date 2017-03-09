var wilkins = require('../src/wilkins');

var logger = new (wilkins.Logger)({
  transports: [
    new (wilkins.transports.Console)({ raw: true }),
  ]
});

logger.log('info', 'Hello, this is a raw logging event',   { 'foo': 'bar' });
logger.log('info', 'Hello, this is a raw logging event 2', { 'foo': 'bar' });
