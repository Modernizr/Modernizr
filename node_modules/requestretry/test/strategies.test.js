'use strict';

var request = require('../');
var t = require('chai').assert;

describe('RetryStrategies', function () {
  it('should have a strategy `HTTPError` to only retry on HTTP errors', function () {
    checkHTTPErrors(request.RetryStrategies.HTTPError);
  });

  it('should have a strategy `NetworkError` to only retry on nodejs network errors', function () {
    checkNetworkErrors(request.RetryStrategies.NetworkError, request.RetryStrategies.NetworkError.RETRIABLE_ERRORS);
  });

  it('should have a strategy `HTTPOrNetworkError` to only retry on nodejs network and HTTP errors', function () {
    checkHTTPErrors(request.RetryStrategies.HTTPOrNetworkError);
    checkNetworkErrors(request.RetryStrategies.HTTPOrNetworkError, request.RetryStrategies.NetworkError.RETRIABLE_ERRORS);
  });
});

function checkNetworkErrors(strategy, errorCodes) {
  errorCodes.forEach(function (errorCode) {
    var err = new Error();
    err.code = errorCode;
    t.ok(strategy(err), 'error code ' + errorCode + ' is recoverable');
  });

  ['hello', 'plop'].forEach(function (errorCode) {
    var err = new Error();
    err.code = errorCode;
    t.ok(!strategy(err), 'error code ' + errorCode + ' is not recoverable');
  });
}

function checkHTTPErrors(strategy) {
  [400, 301, 600].forEach(function (code) {
    t.ok(!strategy(null, {
      statusCode: code
    }), code + ' error is not recoverable');
  });

  [500, 599].forEach(function (code) {
    t.ok(strategy(null, {
      statusCode: code
    }), code + ' error is recoverable');
  });
}
