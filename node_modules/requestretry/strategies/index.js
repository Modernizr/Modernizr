'use strict';
var strategies = module.exports;

strategies.HTTPError = require('./HTTPError');
strategies.NetworkError = require('./NetworkError');
strategies.HTTPOrNetworkError = require('./HTTPOrNetworkError')(strategies.HTTPError, strategies.NetworkError);
