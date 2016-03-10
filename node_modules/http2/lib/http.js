// Public API
// ==========

// The main governing power behind the http2 API design is that it should look very similar to the
// existing node.js [HTTPS API][1] (which is, in turn, almost identical to the [HTTP API][2]). The
// additional features of HTTP/2 are exposed as extensions to this API. Furthermore, node-http2
// should fall back to using HTTP/1.1 if needed. Compatibility with undocumented or deprecated
// elements of the node.js HTTP/HTTPS API is a non-goal.
//
// Additional and modified API elements
// ------------------------------------
//
// - **Class: http2.Endpoint**: an API for using the raw HTTP/2 framing layer. For documentation
//   see the [lib/endpoint.js](endpoint.html) file.
//
// - **Class: http2.Server**
//   - **Event: 'connection' (socket, [endpoint])**: there's a second argument if the negotiation of
//     HTTP/2 was successful: the reference to the [Endpoint](endpoint.html) object tied to the
//     socket.
//
// - **http2.createServer(options, [requestListener])**: additional option:
//   - **log**: an optional [bunyan](https://github.com/trentm/node-bunyan) logger object
//   - **plain**: if `true`, the server will accept HTTP/2 connections over plain TCP instead of
//     TLS
//
// - **Class: http2.ServerResponse**
//   - **response.push(options)**: initiates a server push. `options` describes the 'imaginary'
//     request to which the push stream is a response; the possible options are identical to the
//     ones accepted by `http2.request`. Returns a ServerResponse object that can be used to send
//     the response headers and content.
//
// - **Class: http2.Agent**
//   - **new Agent(options)**: additional option:
//     - **log**: an optional [bunyan](https://github.com/trentm/node-bunyan) logger object
//   - **agent.sockets**: only contains TCP sockets that corresponds to HTTP/1 requests.
//   - **agent.endpoints**: contains [Endpoint](endpoint.html) objects for HTTP/2 connections.
//
// - **http2.request(options, [callback])**: additional option:
//   - **plain**: if `true`, the client will not try to build a TLS tunnel, instead it will use
//     the raw TCP stream for HTTP/2
//
// - **http2.get(options, [callback])**: additional option:
//   - **plain**: if `true`, the client will not try to build a TLS tunnel, instead it will use
//     the raw TCP stream for HTTP/2
//   - this performs request and then also calls request.end() for request instance
//
// - **Class: http2.ClientRequest**
//   - **Event: 'socket' (socket)**: in case of an HTTP/2 incoming message, `socket` is a reference
//     to the associated [HTTP/2 Stream](stream.html) object (and not to the TCP socket).
//   - **Event: 'push' (promise)**: signals the intention of a server push associated to this
//     request. `promise` is an IncomingPromise. If there's no listener for this event, the server
//     push is cancelled.
//   - **request.setPriority(priority)**: assign a priority to this request. `priority` is a number
//     between 0 (highest priority) and 2^31-1 (lowest priority). Default value is 2^30.
//
// - **Class: http2.IncomingMessage**
//   - has two subclasses for easier interface description: **IncomingRequest** and
//     **IncomingResponse**
//   - **message.socket**: in case of an HTTP/2 incoming message, it's a reference to the associated
//     [HTTP/2 Stream](stream.html) object (and not to the TCP socket).
//
// - **Class: http2.IncomingRequest (IncomingMessage)**
//   - **message.url**: in case of an HTTP/2 incoming request, the `url` field always contains the
//     path, and never a full url (it contains the path in most cases in the HTTPS api as well).
//   - **message.scheme**: additional field. Mandatory HTTP/2 request metadata.
//   - **message.host**: additional field. Mandatory HTTP/2 request metadata. Note that this
//     replaces the old Host header field, but node-http2 will add Host to the `message.headers` for
//     backwards compatibility.
//
// - **Class: http2.IncomingPromise (IncomingRequest)**
//   - contains the metadata of the 'imaginary' request to which the server push is an answer.
//   - **Event: 'response' (response)**: signals the arrival of the actual push stream. `response`
//     is an IncomingResponse.
//   - **Event: 'push' (promise)**: signals the intention of a server push associated to this
//     request. `promise` is an IncomingPromise. If there's no listener for this event, the server
//     push is cancelled.
//   - **promise.cancel()**: cancels the promised server push.
//   - **promise.setPriority(priority)**: assign a priority to this push stream. `priority` is a
//     number between 0 (highest priority) and 2^31-1 (lowest priority). Default value is 2^30.
//
// API elements not yet implemented
// --------------------------------
//
// - **Class: http2.Server**
//   - **server.maxHeadersCount**
//
// API elements that are not applicable to HTTP/2
// ----------------------------------------------
//
// The reason may be deprecation of certain HTTP/1.1 features, or that some API elements simply
// don't make sense when using HTTP/2. These will not be present when a request is done with HTTP/2,
// but will function normally when falling back to using HTTP/1.1.
//
// - **Class: http2.Server**
//   - **Event: 'checkContinue'**: not in the spec, yet (see [http-spec#18][expect-continue])
//   - **Event: 'upgrade'**: upgrade is deprecated in HTTP/2
//   - **Event: 'timeout'**: HTTP/2 sockets won't timeout because of application level keepalive
//     (PING frames)
//   - **Event: 'connect'**: not in the spec, yet (see [http-spec#230][connect])
//   - **server.setTimeout(msecs, [callback])**
//   - **server.timeout**
//
// - **Class: http2.ServerResponse**
//   - **Event: 'close'**
//   - **Event: 'timeout'**
//   - **response.writeContinue()**
//   - **response.writeHead(statusCode, [reasonPhrase], [headers])**: reasonPhrase will always be
//     ignored since [it's not supported in HTTP/2][3]
//   - **response.setTimeout(timeout, [callback])**
//
// - **Class: http2.Agent**
//   - **agent.maxSockets**: only affects HTTP/1 connection pool. When using HTTP/2, there's always
//     one connection per host.
//
// - **Class: http2.ClientRequest**
//   - **Event: 'upgrade'**
//   - **Event: 'connect'**
//   - **Event: 'continue'**
//   - **request.setTimeout(timeout, [callback])**
//   - **request.setNoDelay([noDelay])**
//   - **request.setSocketKeepAlive([enable], [initialDelay])**
//
// - **Class: http2.IncomingMessage**
//   - **Event: 'close'**
//   - **message.setTimeout(timeout, [callback])**
//
// [1]: http://nodejs.org/api/https.html
// [2]: http://nodejs.org/api/http.html
// [3]: http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-8.1.2.4
// [expect-continue]: https://github.com/http2/http2-spec/issues/18
// [connect]: https://github.com/http2/http2-spec/issues/230

// Common server and client side code
// ==================================

var net = require('net');
var url = require('url');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var PassThrough = require('stream').PassThrough;
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var protocol = require('./protocol');
var Endpoint = protocol.Endpoint;
var http = require('http');
var https = require('https');

exports.STATUS_CODES = http.STATUS_CODES;
exports.IncomingMessage = IncomingMessage;
exports.OutgoingMessage = OutgoingMessage;
exports.protocol = protocol;

var deprecatedHeaders = [
  'connection',
  'host',
  'keep-alive',
  'proxy-connection',
  'te',
  'transfer-encoding',
  'upgrade'
];

// When doing NPN/ALPN negotiation, HTTP/1.1 is used as fallback
var supportedProtocols = [protocol.VERSION, 'http/1.1', 'http/1.0'];

// Ciphersuite list based on the recommendations of http://wiki.mozilla.org/Security/Server_Side_TLS
// The only modification is that kEDH+AESGCM were placed after DHE and ECDHE suites
var cipherSuites = [
  'ECDHE-RSA-AES128-GCM-SHA256',
  'ECDHE-ECDSA-AES128-GCM-SHA256',
  'ECDHE-RSA-AES256-GCM-SHA384',
  'ECDHE-ECDSA-AES256-GCM-SHA384',
  'DHE-RSA-AES128-GCM-SHA256',
  'DHE-DSS-AES128-GCM-SHA256',
  'ECDHE-RSA-AES128-SHA256',
  'ECDHE-ECDSA-AES128-SHA256',
  'ECDHE-RSA-AES128-SHA',
  'ECDHE-ECDSA-AES128-SHA',
  'ECDHE-RSA-AES256-SHA384',
  'ECDHE-ECDSA-AES256-SHA384',
  'ECDHE-RSA-AES256-SHA',
  'ECDHE-ECDSA-AES256-SHA',
  'DHE-RSA-AES128-SHA256',
  'DHE-RSA-AES128-SHA',
  'DHE-DSS-AES128-SHA256',
  'DHE-RSA-AES256-SHA256',
  'DHE-DSS-AES256-SHA',
  'DHE-RSA-AES256-SHA',
  'kEDH+AESGCM',
  'AES128-GCM-SHA256',
  'AES256-GCM-SHA384',
  'ECDHE-RSA-RC4-SHA',
  'ECDHE-ECDSA-RC4-SHA',
  'AES128',
  'AES256',
  'RC4-SHA',
  'HIGH',
  '!aNULL',
  '!eNULL',
  '!EXPORT',
  '!DES',
  '!3DES',
  '!MD5',
  '!PSK'
].join(':');

// Logging
// -------

// Logger shim, used when no logger is provided by the user.
function noop() {}
var defaultLogger = {
  fatal: noop,
  error: noop,
  warn : noop,
  info : noop,
  debug: noop,
  trace: noop,

  child: function() { return this; }
};

// Bunyan serializers exported by submodules that are worth adding when creating a logger.
exports.serializers = protocol.serializers;

// IncomingMessage class
// ---------------------

function IncomingMessage(stream) {
  // * This is basically a read-only wrapper for the [Stream](stream.html) class.
  PassThrough.call(this);
  stream.pipe(this);
  this.socket = this.stream = stream;

  this._log = stream._log.child({ component: 'http' });

  // * HTTP/2.0 does not define a way to carry the version identifier that is included in the
  //   HTTP/1.1 request/status line. Version is always 2.0.
  this.httpVersion = '2.0';
  this.httpVersionMajor = 2;
  this.httpVersionMinor = 0;

  // * `this.headers` will store the regular headers (and none of the special colon headers)
  this.headers = {};
  this.trailers = undefined;
  this._lastHeadersSeen = undefined;

  // * Other metadata is filled in when the headers arrive.
  stream.once('headers', this._onHeaders.bind(this));
  stream.once('end', this._onEnd.bind(this));
}
IncomingMessage.prototype = Object.create(PassThrough.prototype, { constructor: { value: IncomingMessage } });

// [Request Header Fields](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-8.1.2.3)
// * `headers` argument: HTTP/2.0 request and response header fields carry information as a series
//   of key-value pairs. This includes the target URI for the request, the status code for the
//   response, as well as HTTP header fields.
IncomingMessage.prototype._onHeaders = function _onHeaders(headers) {
  // * Detects malformed headers
  this._validateHeaders(headers);

  // * Store the _regular_ headers in `this.headers`
  for (var name in headers) {
    if (name[0] !== ':') {
      this.headers[name] = headers[name];
    }
  }

  // * The last header block, if it's not the first, will represent the trailers
  var self = this;
  this.stream.on('headers', function(headers) {
    self._lastHeadersSeen = headers;
  });
};

IncomingMessage.prototype._onEnd = function _onEnd() {
  this.trailers = this._lastHeadersSeen;
};

IncomingMessage.prototype.setTimeout = noop;

IncomingMessage.prototype._checkSpecialHeader = function _checkSpecialHeader(key, value) {
  if ((typeof value !== 'string') || (value.length === 0)) {
    this._log.error({ key: key, value: value }, 'Invalid or missing special header field');
    this.stream.reset('PROTOCOL_ERROR');
  }

  return value;
};

IncomingMessage.prototype._validateHeaders = function _validateHeaders(headers) {
  // * An HTTP/2.0 request or response MUST NOT include any of the following header fields:
  //   Connection, Host, Keep-Alive, Proxy-Connection, TE, Transfer-Encoding, and Upgrade. A server
  //   MUST treat the presence of any of these header fields as a stream error of type
  //   PROTOCOL_ERROR.
  for (var i = 0; i < deprecatedHeaders.length; i++) {
    var key = deprecatedHeaders[i];
    if (key in headers) {
      this._log.error({ key: key, value: headers[key] }, 'Deprecated header found');
      this.stream.reset('PROTOCOL_ERROR');
      return;
    }
  }

  for (var headerName in headers) {
    // * Empty header name field is malformed
    if (headerName.length <= 1) {
      this.stream.reset('PROTOCOL_ERROR');
      return;
    }
    // * A request or response containing uppercase header name field names MUST be
    //   treated as malformed (Section 8.1.3.5). Implementations that detect malformed
    //   requests or responses need to ensure that the stream ends.
    if(/[A-Z]/.test(headerName)) {
      this.stream.reset('PROTOCOL_ERROR');
      return;
    }
  }
};

// OutgoingMessage class
// ---------------------

function OutgoingMessage() {
  // * This is basically a read-only wrapper for the [Stream](stream.html) class.
  Writable.call(this);

  this._headers = {};
  this._trailers = undefined;
  this.headersSent = false;
  this.finished = false;

  this.on('finish', this._finish);
}
OutgoingMessage.prototype = Object.create(Writable.prototype, { constructor: { value: OutgoingMessage } });

OutgoingMessage.prototype._write = function _write(chunk, encoding, callback) {
  if (this.stream) {
    this.stream.write(chunk, encoding, callback);
  } else {
    this.once('socket', this._write.bind(this, chunk, encoding, callback));
  }
};

OutgoingMessage.prototype._finish = function _finish() {
  if (this.stream) {
    if (this._trailers) {
      if (this.request) {
        this.request.addTrailers(this._trailers);
      } else {
        this.stream.headers(this._trailers);
      }
    }
    this.finished = true;
    this.stream.end();
  } else {
    this.once('socket', this._finish.bind(this));
  }
};

OutgoingMessage.prototype.setHeader = function setHeader(name, value) {
  if (this.headersSent) {
    throw new Error('Can\'t set headers after they are sent.');
  } else {
    name = name.toLowerCase();
    if (deprecatedHeaders.indexOf(name) !== -1) {
      throw new Error('Cannot set deprecated header: ' + name);
    }
    this._headers[name] = value;
  }
};

OutgoingMessage.prototype.removeHeader = function removeHeader(name) {
  if (this.headersSent) {
    throw new Error('Can\'t remove headers after they are sent.');
  } else {
    delete this._headers[name.toLowerCase()];
  }
};

OutgoingMessage.prototype.getHeader = function getHeader(name) {
  return this._headers[name.toLowerCase()];
};

OutgoingMessage.prototype.addTrailers = function addTrailers(trailers) {
  this._trailers = trailers;
};

OutgoingMessage.prototype.setTimeout = noop;

OutgoingMessage.prototype._checkSpecialHeader = IncomingMessage.prototype._checkSpecialHeader;

// Server side
// ===========

exports.Server = Server;
exports.IncomingRequest = IncomingRequest;
exports.OutgoingResponse = OutgoingResponse;
exports.ServerResponse = OutgoingResponse; // for API compatibility

// Forward events `event` on `source` to all listeners on `target`.
//
// Note: The calling context is `source`.
function forwardEvent(event, source, target) {
  function forward() {
    var listeners = target.listeners(event);

    var n = listeners.length;

    // Special case for `error` event with no listeners.
    if (n === 0 && event === 'error') {
      var args = [event];
      args.push.apply(args, arguments);

      target.emit.apply(target, args);
      return;
    }

    for (var i = 0; i < n; ++i) {
      listeners[i].apply(source, arguments);
    }
  }

  source.on(event, forward);

  // A reference to the function is necessary to be able to stop
  // forwarding.
  return forward;
}

// Server class
// ------------

function Server(options) {
  options = util._extend({}, options);

  this._log = (options.log || defaultLogger).child({ component: 'http' });
  this._settings = options.settings;

  var start = this._start.bind(this);
  var fallback = this._fallback.bind(this);

  // HTTP2 over TLS (using NPN or ALPN)
  if ((options.key && options.cert) || options.pfx) {
    this._log.info('Creating HTTP/2 server over TLS');
    this._mode = 'tls';
    options.ALPNProtocols = supportedProtocols;
    options.NPNProtocols = supportedProtocols;
    options.ciphers = options.ciphers || cipherSuites;
    options.honorCipherOrder = (options.honorCipherOrder != false);
    this._server = https.createServer(options);
    this._originalSocketListeners = this._server.listeners('secureConnection');
    this._server.removeAllListeners('secureConnection');
    this._server.on('secureConnection', function(socket) {
      var negotiatedProtocol = socket.alpnProtocol || socket.npnProtocol;
      // It's true that the client MUST use SNI, but if it doesn't, we don't care, don't fall back to HTTP/1,
      // since if the ALPN negotiation is otherwise successful, the client thinks we speak HTTP/2 but we don't.
      if (negotiatedProtocol === protocol.VERSION) {
        start(socket);
      } else {
        fallback(socket);
      }
    });
    this._server.on('request', this.emit.bind(this, 'request'));

    forwardEvent('error', this._server, this);
    forwardEvent('listening', this._server, this);
  }

  // HTTP2 over plain TCP
  else if (options.plain) {
    this._log.info('Creating HTTP/2 server over plain TCP');
    this._mode = 'plain';
    this._server = net.createServer(start);
  }

  // HTTP/2 with HTTP/1.1 upgrade
  else {
    this._log.error('Trying to create HTTP/2 server with Upgrade from HTTP/1.1');
    throw new Error('HTTP1.1 -> HTTP2 upgrade is not yet supported. Please provide TLS keys.');
  }

  this._server.on('close', this.emit.bind(this, 'close'));
}
Server.prototype = Object.create(EventEmitter.prototype, { constructor: { value: Server } });

// Starting HTTP/2
Server.prototype._start = function _start(socket) {
  var endpoint = new Endpoint(this._log, 'SERVER', this._settings);

  this._log.info({ e: endpoint,
                   client: socket.remoteAddress + ':' + socket.remotePort,
                   SNI: socket.servername
                 }, 'New incoming HTTP/2 connection');

  endpoint.pipe(socket).pipe(endpoint);

  var self = this;
  endpoint.on('stream', function _onStream(stream) {
    var response = new OutgoingResponse(stream);
    var request = new IncomingRequest(stream);

    // Some conformance to Node.js Https specs allows to distinguish clients:
    request.remoteAddress = socket.remoteAddress;
    request.remotePort = socket.remotePort;
    request.connection = request.socket = socket;

    request.once('ready', self.emit.bind(self, 'request', request, response));
  });

  endpoint.on('error', this.emit.bind(this, 'clientError'));
  socket.on('error', this.emit.bind(this, 'clientError'));

  this.emit('connection', socket, endpoint);
};

Server.prototype._fallback = function _fallback(socket) {
  var negotiatedProtocol = socket.alpnProtocol || socket.npnProtocol;

  this._log.info({ client: socket.remoteAddress + ':' + socket.remotePort,
                   protocol: negotiatedProtocol,
                   SNI: socket.servername
                 }, 'Falling back to simple HTTPS');

  for (var i = 0; i < this._originalSocketListeners.length; i++) {
    this._originalSocketListeners[i].call(this._server, socket);
  }

  this.emit('connection', socket);
};

// There are [3 possible signatures][1] of the `listen` function. Every arguments is forwarded to
// the backing TCP or HTTPS server.
// [1]: http://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback
Server.prototype.listen = function listen(port, hostname) {
  this._log.info({ on: ((typeof hostname === 'string') ? (hostname + ':' + port) : port) },
                 'Listening for incoming connections');
  this._server.listen.apply(this._server, arguments);

  return this._server;
};

Server.prototype.close = function close(callback) {
  this._log.info('Closing server');
  this._server.close(callback);
};

Server.prototype.setTimeout = function setTimeout(timeout, callback) {
  if (this._mode === 'tls') {
    this._server.setTimeout(timeout, callback);
  }
};

Object.defineProperty(Server.prototype, 'timeout', {
  get: function getTimeout() {
    if (this._mode === 'tls') {
      return this._server.timeout;
    } else {
      return undefined;
    }
  },
  set: function setTimeout(timeout) {
    if (this._mode === 'tls') {
      this._server.timeout = timeout;
    }
  }
});

// Overriding `EventEmitter`'s `on(event, listener)` method to forward certain subscriptions to
// `server`.There are events on the `http.Server` class where it makes difference whether someone is
// listening on the event or not. In these cases, we can not simply forward the events from the
// `server` to `this` since that means a listener. Instead, we forward the subscriptions.
Server.prototype.on = function on(event, listener) {
  if ((event === 'upgrade') || (event === 'timeout')) {
    return this._server.on(event, listener && listener.bind(this));
  } else {
    return EventEmitter.prototype.on.call(this, event, listener);
  }
};

// `addContext` is used to add Server Name Indication contexts
Server.prototype.addContext = function addContext(hostname, credentials) {
  if (this._mode === 'tls') {
    this._server.addContext(hostname, credentials);
  }
};

function createServerRaw(options, requestListener) {
  if (typeof options === 'function') {
    requestListener = options;
    options = {};
  }

  if (options.pfx || (options.key && options.cert)) {
    throw new Error('options.pfx, options.key, and options.cert are nonsensical!');
  }

  options.plain = true;
  var server = new Server(options);

  if (requestListener) {
    server.on('request', requestListener);
  }

  return server;
}

function createServerTLS(options, requestListener) {
  if (typeof options === 'function') {
    throw new Error('options are required!');
  }
  if (!options.pfx && !(options.key && options.cert)) {
    throw new Error('options.pfx or options.key and options.cert are required!');
  }
  options.plain = false;

  var server = new Server(options);

  if (requestListener) {
    server.on('request', requestListener);
  }

  return server;
}

// Exposed main interfaces for HTTPS connections (the default)
exports.https = {};
exports.createServer = exports.https.createServer = createServerTLS;
exports.request = exports.https.request = requestTLS;
exports.get = exports.https.get = getTLS;

// Exposed main interfaces for raw TCP connections (not recommended)
exports.raw = {};
exports.raw.createServer = createServerRaw;
exports.raw.request = requestRaw;
exports.raw.get = getRaw;

// Exposed main interfaces for HTTP plaintext upgrade connections (not implemented)
function notImplemented() {
    throw new Error('HTTP UPGRADE is not implemented!');
}

exports.http = {};
exports.http.createServer = exports.http.request = exports.http.get = notImplemented;

// IncomingRequest class
// ---------------------

function IncomingRequest(stream) {
  IncomingMessage.call(this, stream);
}
IncomingRequest.prototype = Object.create(IncomingMessage.prototype, { constructor: { value: IncomingRequest } });

// [Request Header Fields](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-8.1.2.3)
// * `headers` argument: HTTP/2.0 request and response header fields carry information as a series
//   of key-value pairs. This includes the target URI for the request, the status code for the
//   response, as well as HTTP header fields.
IncomingRequest.prototype._onHeaders = function _onHeaders(headers) {
  // * The ":method" header field includes the HTTP method
  // * The ":scheme" header field includes the scheme portion of the target URI
  // * The ":authority" header field includes the authority portion of the target URI
  // * The ":path" header field includes the path and query parts of the target URI.
  //   This field MUST NOT be empty; URIs that do not contain a path component MUST include a value
  //   of '/', unless the request is an OPTIONS request for '*', in which case the ":path" header
  //   field MUST include '*'.
  // * All HTTP/2.0 requests MUST include exactly one valid value for all of these header fields. A
  //   server MUST treat the absence of any of these header fields, presence of multiple values, or
  //   an invalid value as a stream error of type PROTOCOL_ERROR.
  this.method = this._checkSpecialHeader(':method'   , headers[':method']);
  this.scheme = this._checkSpecialHeader(':scheme'   , headers[':scheme']);
  this.host   = this._checkSpecialHeader(':authority', headers[':authority']  );
  this.url    = this._checkSpecialHeader(':path'     , headers[':path']  );
  if (!this.method || !this.scheme || !this.host || !this.url) {
    // This is invalid, and we've sent a RST_STREAM, so don't continue processing
    return;
  }

  // * Host header is included in the headers object for backwards compatibility.
  this.headers.host = this.host;

  // * Handling regular headers.
  IncomingMessage.prototype._onHeaders.call(this, headers);

  // * Signaling that the headers arrived.
  this._log.info({ method: this.method, scheme: this.scheme, host: this.host,
                   path: this.url, headers: this.headers }, 'Incoming request');
  this.emit('ready');
};

// OutgoingResponse class
// ----------------------

function OutgoingResponse(stream) {
  OutgoingMessage.call(this);

  this._log = stream._log.child({ component: 'http' });

  this.stream = stream;
  this.statusCode = 200;
  this.sendDate = true;

  this.stream.once('headers', this._onRequestHeaders.bind(this));
}
OutgoingResponse.prototype = Object.create(OutgoingMessage.prototype, { constructor: { value: OutgoingResponse } });

OutgoingResponse.prototype.writeHead = function writeHead(statusCode, reasonPhrase, headers) {
  if (this.headersSent) {
    return;
  }

  if (typeof reasonPhrase === 'string') {
    this._log.warn('Reason phrase argument was present but ignored by the writeHead method');
  } else {
    headers = reasonPhrase;
  }

  for (var name in headers) {
    this.setHeader(name, headers[name]);
  }
  headers = this._headers;

  if (this.sendDate && !('date' in this._headers)) {
    headers.date = (new Date()).toUTCString();
  }

  this._log.info({ status: statusCode, headers: this._headers }, 'Sending server response');

  headers[':status'] = this.statusCode = statusCode;

  this.stream.headers(headers);
  this.headersSent = true;
};

OutgoingResponse.prototype._implicitHeaders = function _implicitHeaders() {
  if (!this.headersSent) {
    this.writeHead(this.statusCode);
  }
};

OutgoingResponse.prototype.write = function write() {
  this._implicitHeaders();
  return OutgoingMessage.prototype.write.apply(this, arguments);
};

OutgoingResponse.prototype.end = function end() {
  this.finshed = true;
  this._implicitHeaders();
  return OutgoingMessage.prototype.end.apply(this, arguments);
};

OutgoingResponse.prototype._onRequestHeaders = function _onRequestHeaders(headers) {
  this._requestHeaders = headers;
};

OutgoingResponse.prototype.push = function push(options) {
  if (typeof options === 'string') {
    options = url.parse(options);
  }

  if (!options.path) {
    throw new Error('`path` option is mandatory.');
  }

  var promise = util._extend({
    ':method': (options.method || 'GET').toUpperCase(),
    ':scheme': (options.protocol && options.protocol.slice(0, -1)) || this._requestHeaders[':scheme'],
    ':authority': options.hostname || options.host || this._requestHeaders[':authority'],
    ':path': options.path
  }, options.headers);

  this._log.info({ method: promise[':method'], scheme: promise[':scheme'],
                   authority: promise[':authority'], path: promise[':path'],
                   headers: options.headers }, 'Promising push stream');

  var pushStream = this.stream.promise(promise);

  return new OutgoingResponse(pushStream);
};

OutgoingResponse.prototype.altsvc = function altsvc(host, port, protocolID, maxAge, origin) {
    if (origin === undefined) {
        origin = "";
    }
    this.stream.altsvc(host, port, protocolID, maxAge, origin);
};

// Overriding `EventEmitter`'s `on(event, listener)` method to forward certain subscriptions to
// `request`. See `Server.prototype.on` for explanation.
OutgoingResponse.prototype.on = function on(event, listener) {
  if (this.request && (event === 'timeout')) {
    this.request.on(event, listener && listener.bind(this));
  } else {
    OutgoingMessage.prototype.on.call(this, event, listener);
  }
};

// Client side
// ===========

exports.ClientRequest = OutgoingRequest; // for API compatibility
exports.OutgoingRequest = OutgoingRequest;
exports.IncomingResponse = IncomingResponse;
exports.Agent = Agent;
exports.globalAgent = undefined;

function requestRaw(options, callback) {
  if (typeof options === "string") {
    options = url.parse(options);
  }
  options.plain = true;
  if (options.protocol && options.protocol !== "http:") {
    throw new Error('This interface only supports http-schemed URLs');
  }
  return (options.agent || exports.globalAgent).request(options, callback);
}

function requestTLS(options, callback) {
  if (typeof options === "string") {
    options = url.parse(options);
  }
  options.plain = false;
  if (options.protocol && options.protocol !== "https:") {
    throw new Error('This interface only supports https-schemed URLs');
  }
  return (options.agent || exports.globalAgent).request(options, callback);
}

function getRaw(options, callback) {
  if (typeof options === "string") {
    options = url.parse(options);
  }
  options.plain = true;
  if (options.protocol && options.protocol !== "http:") {
    throw new Error('This interface only supports http-schemed URLs');
  }
  return (options.agent || exports.globalAgent).get(options, callback);
}

function getTLS(options, callback) {
  if (typeof options === "string") {
    options = url.parse(options);
  }
  options.plain = false;
  if (options.protocol && options.protocol !== "https:") {
    throw new Error('This interface only supports https-schemed URLs');
  }
  return (options.agent || exports.globalAgent).get(options, callback);
}

// Agent class
// -----------

function Agent(options) {
  EventEmitter.call(this);

  options = util._extend({}, options);

  this._settings = options.settings;
  this._log = (options.log || defaultLogger).child({ component: 'http' });
  this.endpoints = {};

  // * Using an own HTTPS agent, because the global agent does not look at `NPN/ALPNProtocols` when
  //   generating the key identifying the connection, so we may get useless non-negotiated TLS
  //   channels even if we ask for a negotiated one. This agent will contain only negotiated
  //   channels.
  options.ALPNProtocols = supportedProtocols;
  options.NPNProtocols = supportedProtocols;
  this._httpsAgent = new https.Agent(options);

  this.sockets = this._httpsAgent.sockets;
  this.requests = this._httpsAgent.requests;
}
Agent.prototype = Object.create(EventEmitter.prototype, { constructor: { value: Agent } });

Agent.prototype.request = function request(options, callback) {
  if (typeof options === 'string') {
    options = url.parse(options);
  } else {
    options = util._extend({}, options);
  }

  options.method = (options.method || 'GET').toUpperCase();
  options.protocol = options.protocol || 'https:';
  options.host = options.hostname || options.host || 'localhost';
  options.port = options.port || 443;
  options.path = options.path || '/';

  if (!options.plain && options.protocol === 'http:') {
    this._log.error('Trying to negotiate client request with Upgrade from HTTP/1.1');
    throw new Error('HTTP1.1 -> HTTP2 upgrade is not yet supported.');
  }

  var request = new OutgoingRequest(this._log);

  if (callback) {
    request.on('response', callback);
  }

  var key = [
    !!options.plain,
    options.host,
    options.port
  ].join(':');
  var self = this;

  // * There's an existing HTTP/2 connection to this host
  if (key in this.endpoints) {
    var endpoint = this.endpoints[key];
    request._start(endpoint.createStream(), options);
  }

  // * HTTP/2 over plain TCP
  else if (options.plain) {
    endpoint = new Endpoint(this._log, 'CLIENT', this._settings);
    endpoint.socket = net.connect({
      host: options.host,
      port: options.port,
      localAddress: options.localAddress
    });

    endpoint.socket.on('error', function (error) {
      self._log.error('Socket error: ' + error.toString());
      request.emit('error', error);
    });

    this.endpoints[key] = endpoint;
    endpoint.pipe(endpoint.socket).pipe(endpoint);
    request._start(endpoint.createStream(), options);
  }

  // * HTTP/2 over TLS negotiated using NPN or ALPN, or fallback to HTTPS1
  else {
    var started = false;
    var createAgent = hasAgentOptions(options);
    options.ALPNProtocols = supportedProtocols;
    options.NPNProtocols = supportedProtocols;
    options.servername = options.host; // Server Name Indication
    options.ciphers = options.ciphers || cipherSuites;
    if (createAgent) {
      options.agent = new https.Agent(options);
    } else if (options.agent == null) {
      options.agent = this._httpsAgent;
    }
    var httpsRequest = https.request(options);

    httpsRequest.on('error', function (error) {
      self._log.error('Socket error: ' + error.toString());
      request.emit('error', error);
    });

    httpsRequest.on('socket', function(socket) {
      var negotiatedProtocol = socket.alpnProtocol || socket.npnProtocol;
      if (negotiatedProtocol != null) { // null in >=0.11.0, undefined in <0.11.0
        negotiated();
      } else {
        socket.on('secureConnect', negotiated);
      }
    });

    function negotiated() {
      var endpoint;
      var negotiatedProtocol = httpsRequest.socket.alpnProtocol || httpsRequest.socket.npnProtocol;
      if (negotiatedProtocol === protocol.VERSION) {
        httpsRequest.socket.emit('agentRemove');
        unbundleSocket(httpsRequest.socket);
        endpoint = new Endpoint(self._log, 'CLIENT', self._settings);
        endpoint.socket = httpsRequest.socket;
        endpoint.pipe(endpoint.socket).pipe(endpoint);
      }
      if (started) {
        // ** In the meantime, an other connection was made to the same host...
        if (endpoint) {
          // *** and it turned out to be HTTP2 and the request was multiplexed on that one, so we should close this one
          endpoint.close();
        }
        // *** otherwise, the fallback to HTTPS1 is already done.
      } else {
        if (endpoint) {
          self._log.info({ e: endpoint, server: options.host + ':' + options.port },
                         'New outgoing HTTP/2 connection');
          self.endpoints[key] = endpoint;
          self.emit(key, endpoint);
        } else {
          self.emit(key, undefined);
        }
      }
    }

    this.once(key, function(endpoint) {
      started = true;
      if (endpoint) {
        request._start(endpoint.createStream(), options);
      } else {
        request._fallback(httpsRequest);
      }
    });
  }

  return request;
};

Agent.prototype.get = function get(options, callback) {
  var request = this.request(options, callback);
  request.end();
  return request;
};

function unbundleSocket(socket) {
  socket.removeAllListeners('data');
  socket.removeAllListeners('end');
  socket.removeAllListeners('readable');
  socket.removeAllListeners('close');
  socket.removeAllListeners('error');
  socket.unpipe();
  delete socket.ondata;
  delete socket.onend;
}

function hasAgentOptions(options) {
  return options.pfx != null ||
    options.key != null ||
    options.passphrase != null ||
    options.cert != null ||
    options.ca != null ||
    options.ciphers != null ||
    options.rejectUnauthorized != null ||
    options.secureProtocol != null;
}

Object.defineProperty(Agent.prototype, 'maxSockets', {
  get: function getMaxSockets() {
    return this._httpsAgent.maxSockets;
  },
  set: function setMaxSockets(value) {
    this._httpsAgent.maxSockets = value;
  }
});

exports.globalAgent = new Agent();

// OutgoingRequest class
// ---------------------

function OutgoingRequest() {
  OutgoingMessage.call(this);

  this._log = undefined;

  this.stream = undefined;
}
OutgoingRequest.prototype = Object.create(OutgoingMessage.prototype, { constructor: { value: OutgoingRequest } });

OutgoingRequest.prototype._start = function _start(stream, options) {
  this.stream = stream;
  this.options = options;

  this._log = stream._log.child({ component: 'http' });

  for (var key in options.headers) {
    this.setHeader(key, options.headers[key]);
  }
  var headers = this._headers;
  delete headers.host;

  if (options.auth) {
    headers.authorization = 'Basic ' + new Buffer(options.auth).toString('base64');
  }

  headers[':scheme'] = options.protocol.slice(0, -1);
  headers[':method'] = options.method;
  headers[':authority'] = options.host;
  headers[':path'] = options.path;

  this._log.info({ scheme: headers[':scheme'], method: headers[':method'],
                   authority: headers[':authority'], path: headers[':path'],
                   headers: (options.headers || {}) }, 'Sending request');
  this.stream.headers(headers);
  this.headersSent = true;

  this.emit('socket', this.stream);
  var response = new IncomingResponse(this.stream);
  response.req = this;
  response.once('ready', this.emit.bind(this, 'response', response));

  this.stream.on('promise', this._onPromise.bind(this));
};

OutgoingRequest.prototype._fallback = function _fallback(request) {
  request.on('response', this.emit.bind(this, 'response'));
  this.stream = this.request = request;
  this.emit('socket', this.socket);
};

OutgoingRequest.prototype.setPriority = function setPriority(priority) {
  if (this.stream) {
    this.stream.priority(priority);
  } else {
    this.once('socket', this.setPriority.bind(this, priority));
  }
};

// Overriding `EventEmitter`'s `on(event, listener)` method to forward certain subscriptions to
// `request`. See `Server.prototype.on` for explanation.
OutgoingRequest.prototype.on = function on(event, listener) {
  if (this.request && (event === 'upgrade')) {
    this.request.on(event, listener && listener.bind(this));
  } else {
    OutgoingMessage.prototype.on.call(this, event, listener);
  }
};

// Methods only in fallback mode
OutgoingRequest.prototype.setNoDelay = function setNoDelay(noDelay) {
  if (this.request) {
    this.request.setNoDelay(noDelay);
  } else if (!this.stream) {
    this.on('socket', this.setNoDelay.bind(this, noDelay));
  }
};

OutgoingRequest.prototype.setSocketKeepAlive = function setSocketKeepAlive(enable, initialDelay) {
  if (this.request) {
    this.request.setSocketKeepAlive(enable, initialDelay);
  } else if (!this.stream) {
    this.on('socket', this.setSocketKeepAlive.bind(this, enable, initialDelay));
  }
};

OutgoingRequest.prototype.setTimeout = function setTimeout(timeout, callback) {
  if (this.request) {
    this.request.setTimeout(timeout, callback);
  } else if (!this.stream) {
    this.on('socket', this.setTimeout.bind(this, timeout, callback));
  }
};

// Aborting the request
OutgoingRequest.prototype.abort = function abort() {
  if (this.request) {
    this.request.abort();
  } else if (this.stream) {
    this.stream.reset('CANCEL');
  } else {
    this.on('socket', this.abort.bind(this));
  }
};

// Receiving push promises
OutgoingRequest.prototype._onPromise = function _onPromise(stream, headers) {
  this._log.info({ push_stream: stream.id }, 'Receiving push promise');

  var promise = new IncomingPromise(stream, headers);

  if (this.listeners('push').length > 0) {
    this.emit('push', promise);
  } else {
    promise.cancel();
  }
};

// IncomingResponse class
// ----------------------

function IncomingResponse(stream) {
  IncomingMessage.call(this, stream);
}
IncomingResponse.prototype = Object.create(IncomingMessage.prototype, { constructor: { value: IncomingResponse } });

// [Response Header Fields](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-8.1.2.4)
// * `headers` argument: HTTP/2.0 request and response header fields carry information as a series
//   of key-value pairs. This includes the target URI for the request, the status code for the
//   response, as well as HTTP header fields.
IncomingResponse.prototype._onHeaders = function _onHeaders(headers) {
  // * A single ":status" header field is defined that carries the HTTP status code field. This
  //   header field MUST be included in all responses.
  // * A client MUST treat the absence of the ":status" header field, the presence of multiple
  //   values, or an invalid value as a stream error of type PROTOCOL_ERROR.
  //   Note: currently, we do not enforce it strictly: we accept any format, and parse it as int
  // * HTTP/2.0 does not define a way to carry the reason phrase that is included in an HTTP/1.1
  //   status line.
  this.statusCode = parseInt(this._checkSpecialHeader(':status', headers[':status']));

  // * Handling regular headers.
  IncomingMessage.prototype._onHeaders.call(this, headers);

  // * Signaling that the headers arrived.
  this._log.info({ status: this.statusCode, headers: this.headers}, 'Incoming response');
  this.emit('ready');
};

// IncomingPromise class
// -------------------------

function IncomingPromise(responseStream, promiseHeaders) {
  var stream = new Readable();
  stream._read = noop;
  stream.push(null);
  stream._log = responseStream._log;

  IncomingRequest.call(this, stream);

  this._onHeaders(promiseHeaders);

  this._responseStream = responseStream;

  var response = new IncomingResponse(this._responseStream);
  response.once('ready', this.emit.bind(this, 'response', response));

  this.stream.on('promise', this._onPromise.bind(this));
}
IncomingPromise.prototype = Object.create(IncomingRequest.prototype, { constructor: { value: IncomingPromise } });

IncomingPromise.prototype.cancel = function cancel() {
  this._responseStream.reset('CANCEL');
};

IncomingPromise.prototype.setPriority = function setPriority(priority) {
  this._responseStream.priority(priority);
};

IncomingPromise.prototype._onPromise = OutgoingRequest.prototype._onPromise;
