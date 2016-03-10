'use strict';

var util = require('util');

function ProxyquireError(msg) {
  this.name = 'ProxyquireError';
  Error.captureStackTrace(this, ProxyquireError);
  this.message = msg || 'An error occurred inside proxyquire.';
}

util.inherits(ProxyquireError, Error);

module.exports = ProxyquireError;
