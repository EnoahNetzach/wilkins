/*
 * custom-pretty-print-test.js: Test function as pretty print option.
 *
 * (C) 2015 Alberto Pose
 * MIT LICENSE
 *
 */

var assert = require('assert'),
    vows = require('vows'),
    wilkins = require('../src/wilkins'),
    Memory = require('../src/transports/memory').Memory;

/* Custom logging function */
function myPrettyPrint(obj) {
  return JSON.stringify(obj)
    .replace(/\{/g, '< wow ')
    .replace(/\:/g, ' such ')
    .replace(/\}/g, ' >');
}

vows.describe('wilkins/transport/prettyPrint').addBatch({
  "When pretty option is used": {
    "with memory transport": {
      topic: function () {
        var transport = new Memory({prettyPrint: myPrettyPrint});
        return this.callback(null, transport);
      },
      "should log using a function value": function (_, transport) {
        transport.log('info', 'hello', {foo: 'bar'}, function (_, logged) {
          assert.ok(logged);
          assert.equal(1, transport.writeOutput.length);

          var msg = transport.writeOutput[0];
          assert.equal('info: hello < wow "foo" such "bar" >', msg);
        });
      }
    }
  }
}).export(module);
