var wilkins = require('../src/wilkins');

//
// Create a new wilkins logger instance with two tranports: Console, and Couchdb
//
//
// The Console transport will simply output to the console screen
// The CouchDB tranport will perform an HTTP POST request to the specified CouchDB instance
//
var logger = new (wilkins.Logger)({
  transports: [
    new (wilkins.transports.Console)(),
    new (wilkins.transports.Couchdb)({ 'host': 'localhost', 'db': 'logs' })
    // if you need auth do this: new (wilkins.transports.Couchdb)({ 'user': 'admin', 'pass': 'admin', 'host': 'localhost', 'db': 'logs' })
  ]
});

logger.log('info', 'Hello log files!', { 'foo': 'bar' });
