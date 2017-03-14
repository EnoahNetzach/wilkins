var assert = require('assert'),
    wilkins = require('../../lib/wilkins'),
    helpers = require('../helpers');

module.exports = function (transport, options) {
  var logger = transport instanceof wilkins.Logger
    ? transport
    : new wilkins.Logger({
        transports: [
          new transport(options)
        ]
      });

  var transport = logger.transports[logger._names[0]];

  var out = {
    'topic': logger,
    'the stream() method': {
      'using no options': {
        'topic': function () {
          if (!transport.stream) return;

          logger.log('info', 'hello world', {});

          var cb = this.callback,
              j = 10,
              i = 10,
              results = [],
              stream = logger.stream();

          stream.on('log', function (log) {
            results.push(log);
            results.stream = stream;
            if (!--j) cb(null, results);
          });

          stream.on('error', function (err) {
            j = -1; //don't call the callback again
            cb(err);
          });

          while (i--) logger.log('info', 'hello world ' + i, {});
        },
        'should stream logs': function (err, results) {
          if (!transport.stream) return;
          assert.isNull(err);
          results.forEach(function (log) {
            assert.ok(log.message.indexOf('hello world') === 0
                      || log.message.indexOf('test message') === 0);
          });
          results.stream.destroy();
        }
      }
    }
  };

  return out;
};
