# basic-auth

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Generic basic auth Authorization header field parser for whatever.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```
$ npm install basic-auth
```

## API

<!-- eslint-disable no-unused-vars -->

```js
var auth = require('basic-auth')
```

### auth(req)

Get the basic auth credentials from the given request. The `Authorization`
header is parsed and if the header is invalid, `undefined` is returned,
otherwise an object with `name` and `pass` properties.

### auth.parse(string)

Parse a basic auth authorization header string. This will return an object
with `name` and `pass` properties, or `undefined` if the string is invalid.

## Example

Pass a node request or koa Context object to the module exported. If
parsing fails `undefined` is returned, otherwise an object with
`.name` and `.pass`.

<!-- eslint-disable no-unused-vars, no-undef -->

```js
var auth = require('basic-auth')
var user = auth(req)
// => { name: 'something', pass: 'whatever' }
```

A header string from any other location can also be parsed with
`auth.parse`, for example a `Proxy-Authorization` header:

<!-- eslint-disable no-unused-vars, no-undef -->

```js
var auth = require('basic-auth')
var user = auth.parse(req.getHeader('Proxy-Authorization'))
```

### With vanilla node.js http server

```js
var http = require('http')
var auth = require('basic-auth')

// Create server
var server = http.createServer(function (req, res) {
  var credentials = auth(req)

  if (!credentials || credentials.name !== 'john' || credentials.pass !== 'secret') {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    res.end('Access denied')
  } else {
    res.end('Access granted')
  }
})

// Listen
server.listen(3000)
```

# License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/basic-auth.svg
[npm-url]: https://npmjs.org/package/basic-auth
[node-version-image]: https://img.shields.io/node/v/basic-auth.svg
[node-version-url]: https://nodejs.org/en/download
[travis-image]: https://img.shields.io/travis/jshttp/basic-auth/master.svg
[travis-url]: https://travis-ci.org/jshttp/basic-auth
[coveralls-image]: https://img.shields.io/coveralls/jshttp/basic-auth/master.svg
[coveralls-url]: https://coveralls.io/r/jshttp/basic-auth?branch=master
[downloads-image]: https://img.shields.io/npm/dm/basic-auth.svg
[downloads-url]: https://npmjs.org/package/basic-auth
