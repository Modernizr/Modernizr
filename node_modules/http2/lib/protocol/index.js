// This is an implementation of the [HTTP/2][http2]
// framing layer for [node.js][node].
//
// The main building blocks are [node.js streams][node-stream] that are connected through pipes.
//
// The main components are:
//
// * [Endpoint](endpoint.html): represents an HTTP/2 endpoint (client or server). It's
//   responsible for the the first part of the handshake process (sending/receiving the
//   [connection header][http2-connheader]) and manages other components (framer, compressor,
//   connection, streams) that make up a client or server.
//
// * [Connection](connection.html): multiplexes the active HTTP/2 streams, manages connection
//   lifecycle and settings, and responsible for enforcing the connection level limits (flow
//   control, initiated stream limit)
//
// * [Stream](stream.html): implementation of the [HTTP/2 stream concept][http2-stream].
//   Implements the [stream state machine][http2-streamstate] defined by the standard, provides
//   management methods and events for using the stream (sending/receiving headers, data, etc.),
//   and enforces stream level constraints (flow control, sending only legal frames).
//
// * [Flow](flow.html): implements flow control for Connection and Stream as parent class.
//
// * [Compressor and Decompressor](compressor.html): compression and decompression of HEADER and
//   PUSH_PROMISE frames
//
// * [Serializer and Deserializer](framer.html): the lowest layer in the stack that transforms
//   between the binary and the JavaScript object representation of HTTP/2 frames
//
// [http2]:               https://tools.ietf.org/html/rfc7540
// [http2-connheader]:    https://tools.ietf.org/html/rfc7540#section-3.5
// [http2-stream]:        https://tools.ietf.org/html/rfc7540#section-5
// [http2-streamstate]:   https://tools.ietf.org/html/rfc7540#section-5.1
// [node]:                https://nodejs.org/
// [node-stream]:         https://nodejs.org/api/stream.html
// [node-https]:          https://nodejs.org/api/https.html
// [node-http]:           https://nodejs.org/api/http.html

exports.VERSION = 'h2';

exports.Endpoint = require('./endpoint').Endpoint;

/* Bunyan serializers exported by submodules that are worth adding when creating a logger. */
exports.serializers = {};
var modules = ['./framer', './compressor', './flow', './connection', './stream', './endpoint'];
modules.map(require).forEach(function(module) {
  for (var name in module.serializers) {
    exports.serializers[name] = module.serializers[name];
  }
});

/*
              Stream API            Endpoint API
              Stream data

             |            ^        |            ^
             |            |        |            |
             |            |        |            |
 +-----------|------------|---------------------------------------+
 |           |            |   Endpoint                            |
 |           |            |                                       |
 |   +-------|------------|-----------------------------------+   |
 |   |       |            |  Connection                       |   |
 |   |       v            |                                   |   |
 |   |  +-----------------------+  +--------------------      |   |
 |   |  |        Stream         |  |         Stream      ...  |   |
 |   |  +-----------------------+  +--------------------      |   |
 |   |       |            ^              |            ^       |   |
 |   |       v            |              v            |       |   |
 |   |       +------------+--+--------+--+------------+- ...  |   |
 |   |                       |        ^                       |   |
 |   |                       |        |                       |   |
 |   +-----------------------|--------|-----------------------+   |
 |                           |        |                           |
 |                           v        |                           |
 |   +--------------------------+  +--------------------------+   |
 |   |        Compressor        |  |       Decompressor       |   |
 |   +--------------------------+  +--------------------------+   |
 |                           |        ^                           |
 |                           v        |                           |
 |   +--------------------------+  +--------------------------+   |
 |   |        Serializer        |  |       Deserializer       |   |
 |   +--------------------------+  +--------------------------+   |
 |                           |        ^                           |
 +---------------------------|--------|---------------------------+
                             |        |
                             v        |

                              Raw data

*/
