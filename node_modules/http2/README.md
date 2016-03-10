node-http2
==========

An HTTP/2 ([RFC 7540](http://tools.ietf.org/html/rfc7540))
client and server implementation for node.js.

![Travis CI status](https://travis-ci.org/molnarg/node-http2.svg?branch=master)

Installation
------------

```
npm install http2
```

API
---

The API is very similar to the [standard node.js HTTPS API](http://nodejs.org/api/https.html). The
goal is the perfect API compatibility, with additional HTTP2 related extensions (like server push).

Detailed API documentation is primarily maintained in the `lib/http.js` file and is [available in
the wiki](https://github.com/molnarg/node-http2/wiki/Public-API) as well.

Examples
--------

### Using as a server ###

```javascript
var options = {
  key: fs.readFileSync('./example/localhost.key'),
  cert: fs.readFileSync('./example/localhost.crt')
};

require('http2').createServer(options, function(request, response) {
  response.end('Hello world!');
}).listen(8080);
```

### Using as a client ###

```javascript
require('http2').get('https://localhost:8080/', function(response) {
  response.pipe(process.stdout);
});
```

### Simple static file server ###

An simple static file server serving up content from its own directory is available in the `example`
directory. Running the server:

```bash
$ node ./example/server.js
```

### Simple command line client ###

An example client is also available. Downloading the server's own source code from the server:

```bash
$ node ./example/client.js 'https://localhost:8080/server.js' >/tmp/server.js
```

### Server push ###

For a server push example, see the source code of the example
[server](https://github.com/molnarg/node-http2/blob/master/example/server.js) and
[client](https://github.com/molnarg/node-http2/blob/master/example/client.js).

Status
------

* ALPN is only supported in node.js >= 5.0
* Upgrade mechanism to start HTTP/2 over unencrypted channel is not implemented yet
  (issue [#4](https://github.com/molnarg/node-http2/issues/4))
* Other minor features found in
  [this list](https://github.com/molnarg/node-http2/issues?labels=feature) are not implemented yet

Development
-----------

### Development dependencies ###

There's a few library you will need to have installed to do anything described in the following
sections. After installing/cloning node-http2, run `npm install` in its directory to install
development dependencies.

Used libraries:

* [mocha](http://visionmedia.github.io/mocha/) for tests
* [chai](http://chaijs.com/) for assertions
* [istanbul](https://github.com/gotwarlost/istanbul) for code coverage analysis
* [docco](http://jashkenas.github.io/docco/) for developer documentation
* [bunyan](https://github.com/trentm/node-bunyan) for logging

For pretty printing logs, you will also need a global install of bunyan (`npm install -g bunyan`).

### Developer documentation ###

The developer documentation is generated from the source code using docco and can be viewed online
[here](http://molnarg.github.io/node-http2/doc/). If you'd like to have an offline copy, just run
`npm run-script doc`.

### Running the tests ###

It's easy, just run `npm test`. The tests are written in BDD style, so they are a good starting
point to understand the code.

### Test coverage ###

To generate a code coverage report, run `npm test --coverage` (which runs very slowly, be patient).
Code coverage summary as of version 3.0.1:
```
Statements   : 92.09% ( 1759/1910 )
Branches     : 82.56% ( 696/843 )
Functions    : 91.38% ( 212/232 )
Lines        : 92.17% ( 1753/1902 )
```

There's a hosted version of the detailed (line-by-line) coverage report
[here](http://molnarg.github.io/node-http2/coverage/lcov-report/lib/).

### Logging ###

Logging is turned off by default. You can turn it on by passing a bunyan logger as `log` option when
creating a server or agent.

When using the example server or client, it's very easy to turn logging on: set the `HTTP2_LOG`
environment variable to `fatal`, `error`, `warn`, `info`, `debug` or `trace` (the logging level).
To log every single incoming and outgoing data chunk, use `HTTP2_LOG_DATA=1` besides
`HTTP2_LOG=trace`. Log output goes to the standard error output. If the standard error is redirected
into a file, then the log output is in bunyan's JSON format for easier post-mortem analysis.

Running the example server and client with `info` level logging output:

```bash
$ HTTP2_LOG=info node ./example/server.js
```

```bash
$ HTTP2_LOG=info node ./example/client.js 'https://localhost:8080/server.js' >/dev/null
```

Contributors
------------

The co-maintainer of the project is [Nick Hurley](https://github.com/todesschaf).

Code contributions are always welcome! People who contributed to node-http2 so far:

* [Nick Hurley](https://github.com/todesschaf)
* [Mike Belshe](https://github.com/mbelshe)
* [Yoshihiro Iwanaga](https://github.com/iwanaga)
* [Igor Novikov](https://github.com/vsemogutor)
* [James Willcox](https://github.com/snorp)
* [David Björklund](https://github.com/kesla)
* [Patrick McManus](https://github.com/mcmanus)

Special thanks to Google for financing the development of this module as part of their [Summer of
Code program](https://developers.google.com/open-source/soc/) (project: [HTTP/2 prototype server
implementation](https://google-melange.appspot.com/gsoc/project/details/google/gsoc2013/molnarg/5818821692620800)), and
Nick Hurley of Mozilla, my GSoC mentor, who helped with regular code review and technical advices.

License
-------

The MIT License

Copyright (C) 2013 Gábor Molnár <gabor@molnar.es>
