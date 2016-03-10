# Request-retry [![Deps](https://david-dm.org/FGRibreau/node-request-retry.png)](https://david-dm.org/FGRibreau/node-request-retry) [![Build Status](https://drone.io/github.com/FGRibreau/node-request-retry/status.png)](https://drone.io/github.com/FGRibreau/node-request-retry/latest)

[![npm](https://nodei.co/npm/requestretry.png)](https://npmjs.org/package/requestretry)

When the connection fails with one of `ECONNRESET`, `ENOTFOUND`, `ESOCKETTIMEDOUT`, `ETIMEDOUT`, `ECONNREFUSED`, `EHOSTUNREACH`, `EPIPE` or when an HTTP 5xx error occurrs, the request will automatically be re-attempted as these are often recoverable errors and will go away on retry.

## Usage

Request-retry is a drop-in replacement for [request](https://github.com/mikeal/request) but adds two new options `maxAttempts` and `retryDelay`.

```javascript
var request = require('requestretry');

request({
  url: 'https://api.domain.com/v1/a/b'
  json:true,

  // The above parameters are specific to Request-retry
  maxAttempts: 5,   // (default) try 5 times
  retryDelay: 5000,  // (default) wait for 5s before trying again
  retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
}, function(err, response, body){
  // this callback will only be called when the request succeeded or after maxAttempts or on error
});
```

## Installation

Install with [npm](https://npmjs.org/package/requestretry).

    npm install --save requestretry

## How to define your own retry strategy

```
/**
 * @param  {Null | Object} err
 * @param  {Object} response
 * @return {Boolean} true if the request should be retried
 */
function myRetryStrategy(err, response){
  // retry the request if we had an error or if the response was a 'Bad Gateway'
  return err || response.statusCode === 502;
}

request({
  url: 'https://api.domain.com/v1/a/b'
  json:true,
  retryStrategy: myRetryStrategy
}, function(err, response, body){
  // this callback will only be called when the request succeeded or after maxAttempts or on error
});
```

## Todo

- Tests
- Use an EventEmitter to notify retries

## Changelog

<a name="v1.2.2" />
[v1.2.2](#v1.2.2)

  - update `request` to 2.51.0

<a name="v1.2.1" />
[v1.2.1](#v1.2.1)

  - add support for 'write' request method by @juliendangers

<a name="v1.2.0" />
[v1.2.0](#v1.2.0)

  - support for user-defined retry strategies
  - added `request.RetryStrategies.HTTPError`, `request.RetryStrategies.NetworkError` and `request.RetryStrategies.HTTPOrNetworkError`

<a name="v1.1.0" />
[v1.1.0](#v1.1.0)

  - support for 'end', 'on', 'emit', 'once', 'setMaxListeners', 'start', 'removeListener', 'pipe' request methods by @juliendangers

<a name="v1.0.4" />
[v1.0.4](#v1.0.4)

  - added `EPIPE`

<a name="v1.0.3" />
[v1.0.3](#v1.0.3)

  - added `EHOSTUNREACH`

<a name="v1.0.2" />
[v1.0.2](#v1.0.2)

  - upgraded `request` to 2.44.0 (19/09/2014)
  - callback is now optional

<a name="v1.0.1" />
[v1.0.1](#v1.0.1): 

  - added `cancelable` as deps

<a name="v1.0.0" />
[v1.0.0](#v1.0.0):

  - request now yield an Request instance with a `.abort()` method.

<a name="v0.0.1" />
[v0.0.1](#v0.0.1) 

  - initial commit

Copyright 2014, [Francois-Guillaume Ribreau](http://fgribreau.com) (npm@fgribreau.com)
