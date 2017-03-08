var wilkins = require('../lib/wilkins');

function myPrettyPrint(obj) {
  return JSON.stringify(obj)
    .replace(/\{/g, '< wow ')
    .replace(/\:/g, ' such ')
    .replace(/\}/g, ' >');
}

var logger = new (wilkins.Logger)({
  transports: [
    new (wilkins.transports.Console)({ prettyPrint: myPrettyPrint }),
  ]
});

logger.info('Hello, this is a logging event with a custom pretty print',  { 'foo': 'bar' });
logger.info('Hello, this is a logging event with a custom pretty print2', { 'foo': 'bar' });

