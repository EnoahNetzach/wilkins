
var fs = require('fs'),
    path = require('path'),
    wilkins = require('../lib/wilkins');

var filename = path.join(__dirname, 'created-logfile.log');

//
// Remove the file, ignoring any errors
//
try { fs.unlinkSync(filename); }
catch (ex) { }

//
// Create a new wilkins logger instance with two tranports: Console, and File
//
//
var logger = new (wilkins.Logger)({
  transports: [
    new (wilkins.transports.Console)(),
    new (wilkins.transports.File)({ filename: filename })
  ]
});

logger.log('info', 'Hello created log files!', { 'foo': 'bar' });

setTimeout(function () {
  //
  // Remove the file, ignoring any errors
  //
  try { fs.unlinkSync(filename); }
  catch (ex) { }
}, 1000);
