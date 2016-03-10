'use strict';

var request = require('../');
var t = require('chai').assert;

describe('Request-retry', function () {
  it('should return a RequestRetry handler object with a abort method', function (done) {
    var o = request({
      url: 'http://filltext.com/?rows=1&delay=10', // wait for 4s
      json: true
    }, function (err) {
      t.strictEqual(err.toString(), 'Error: Aborted');
      done();
    });

    o.abort();
  });
});
