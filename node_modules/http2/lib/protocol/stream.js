var assert = require('assert');

// The Stream class
// ================

// Stream is a [Duplex stream](http://nodejs.org/api/stream.html#stream_class_stream_duplex)
// subclass that implements the [HTTP/2 Stream](http://http2.github.io/http2-spec/#rfc.section.3.4)
// concept. It has two 'sides': one that is used by the user to send/receive data (the `stream`
// object itself) and one that is used by a Connection to read/write frames to/from the other peer
// (`stream.upstream`).

var Duplex = require('stream').Duplex;

exports.Stream = Stream;

// Public API
// ----------

// * **new Stream(log, connection)**: create a new Stream
//
// * **Event: 'headers' (headers)**: signals incoming headers
//
// * **Event: 'promise' (stream, headers)**: signals an incoming push promise
//
// * **Event: 'priority' (priority)**: signals a priority change. `priority` is a number between 0
//     (highest priority) and 2^31-1 (lowest priority). Default value is 2^30.
//
// * **Event: 'error' (type)**: signals an error
//
// * **headers(headers)**: send headers
//
// * **promise(headers): Stream**: promise a stream
//
// * **priority(priority)**: set the priority of the stream. Priority can be changed by the peer
//   too, but once it is set locally, it can not be changed remotely.
//
// * **reset(error)**: reset the stream with an error code
//
// * **upstream**: a [Flow](flow.js) that is used by the parent connection to write/read frames
//   that are to be sent/arrived to/from the peer and are related to this stream.
//
// Headers are always in the [regular node.js header format][1].
// [1]: http://nodejs.org/api/http.html#http_message_headers

// Constructor
// -----------

// The main aspects of managing the stream are:
function Stream(log, connection) {
  Duplex.call(this);

  // * logging
  this._log = log.child({ component: 'stream', s: this });

  // * receiving and sending stream management commands
  this._initializeManagement();

  // * sending and receiving frames to/from the upstream connection
  this._initializeDataFlow();

  // * maintaining the state of the stream (idle, open, closed, etc.) and error detection
  this._initializeState();

  this.connection = connection;
}

Stream.prototype = Object.create(Duplex.prototype, { constructor: { value: Stream } });

// Managing the stream
// -------------------

// the default stream priority is 2^30
var DEFAULT_PRIORITY = Math.pow(2, 30);
var MAX_PRIORITY = Math.pow(2, 31) - 1;

// PUSH_PROMISE and HEADERS are forwarded to the user through events.
Stream.prototype._initializeManagement = function _initializeManagement() {
  this._resetSent = false;
  this._priority = DEFAULT_PRIORITY;
  this._letPeerPrioritize = true;
};

Stream.prototype.promise = function promise(headers) {
  var stream = new Stream(this._log, this.connection);
  stream._priority = Math.min(this._priority + 1, MAX_PRIORITY);
  this._pushUpstream({
    type: 'PUSH_PROMISE',
    flags: {},
    stream: this.id,
    promised_stream: stream,
    headers: headers
  });
  return stream;
};

Stream.prototype._onPromise = function _onPromise(frame) {
  this.emit('promise', frame.promised_stream, frame.headers);
};

Stream.prototype.headers = function headers(headers) {
  this._pushUpstream({
    type: 'HEADERS',
    flags: {},
    stream: this.id,
    headers: headers
  });
};

Stream.prototype._onHeaders = function _onHeaders(frame) {
  if (frame.priority !== undefined) {
    this.priority(frame.priority, true);
  }
  this.emit('headers', frame.headers);
};

Stream.prototype.priority = function priority(priority, peer) {
  if ((peer && this._letPeerPrioritize) || !peer) {
    if (!peer) {
      this._letPeerPrioritize = false;

      var lastFrame = this.upstream.getLastQueuedFrame();
      if (lastFrame && ((lastFrame.type === 'HEADERS') || (lastFrame.type === 'PRIORITY'))) {
        lastFrame.priority = priority;
      } else {
        this._pushUpstream({
          type: 'PRIORITY',
          flags: {},
          stream: this.id,
          priority: priority
        });
      }
    }

    this._log.debug({ priority: priority }, 'Changing priority');
    this.emit('priority', priority);
    this._priority = priority;
  }
};

Stream.prototype._onPriority = function _onPriority(frame) {
  this.priority(frame.priority, true);
};

// Resetting the stream. Normally, an endpoint SHOULD NOT send more than one RST_STREAM frame for
// any stream.
Stream.prototype.reset = function reset(error) {
  if (!this._resetSent) {
    this._resetSent = true;
    this._pushUpstream({
      type: 'RST_STREAM',
      flags: {},
      stream: this.id,
      error: error
    });
  }
};

// Specify an alternate service for the origin of this stream
Stream.prototype.altsvc = function altsvc(host, port, protocolID, maxAge, origin) {
    var stream;
    if (origin) {
        stream = 0;
    } else {
        stream = this.id;
    }
    this._pushUpstream({
        type: 'ALTSVC',
        flags: {},
        stream: stream,
        host: host,
        port: port,
        protocolID: protocolID,
        origin: origin,
        maxAge: maxAge
    });
};

// Data flow
// ---------

// The incoming and the generated outgoing frames are received/transmitted on the `this.upstream`
// [Flow](flow.html). The [Connection](connection.html) object instantiating the stream will read
// and write frames to/from it. The stream itself is a regular [Duplex stream][1], and is used by
// the user to write or read the body of the request.
// [1]: http://nodejs.org/api/stream.html#stream_class_stream_duplex

//     upstream side                  stream                  user side
//
//                    +------------------------------------+
//                    |                                    |
//                    +------------------+                 |
//                    |     upstream     |                 |
//                    |                  |                 |
//                    +--+               |              +--|
//            read()  |  |  _send()      |    _write()  |  |  write(buf)
//     <--------------|B |<--------------|--------------| B|<------------
//                    |  |               |              |  |
//            frames  +--+               |              +--|  buffers
//                    |  |               |              |  |
//     -------------->|B |---------------|------------->| B|------------>
//      write(frame)  |  |  _receive()   |     _read()  |  |  read()
//                    +--+               |              +--|
//                    |                  |                 |
//                    |                  |                 |
//                    +------------------+                 |
//                    |                                    |
//                    +------------------------------------+
//
//     B: input or output buffer

var Flow = require('./flow').Flow;

Stream.prototype._initializeDataFlow = function _initializeDataFlow() {
  this.id = undefined;

  this._ended = false;

  this.upstream = new Flow();
  this.upstream._log = this._log;
  this.upstream._send = this._send.bind(this);
  this.upstream._receive = this._receive.bind(this);
  this.upstream.write = this._writeUpstream.bind(this);
  this.upstream.on('error', this.emit.bind(this, 'error'));

  this.on('finish', this._finishing);
};

Stream.prototype._pushUpstream = function _pushUpstream(frame) {
  this.upstream.push(frame);
  this._transition(true, frame);
};

// Overriding the upstream's `write` allows us to act immediately instead of waiting for the input
// queue to empty. This is important in case of control frames.
Stream.prototype._writeUpstream = function _writeUpstream(frame) {
  this._log.debug({ frame: frame }, 'Receiving frame');

  var moreNeeded = Flow.prototype.write.call(this.upstream, frame);

  // * Transition to a new state if that's the effect of receiving the frame
  this._transition(false, frame);

  // * If it's a control frame. Call the appropriate handler method.
  if (frame.type === 'HEADERS') {
    if (this._processedHeaders && !frame.flags['END_STREAM']) {
      this.emit('error', 'PROTOCOL_ERROR');
    }
    this._processedHeaders = true;
    this._onHeaders(frame);
  } else if (frame.type === 'PUSH_PROMISE') {
    this._onPromise(frame);
  } else if (frame.type === 'PRIORITY') {
    this._onPriority(frame);
  } else if (frame.type === 'ALTSVC') {
    // TODO
  } else if (frame.type === 'BLOCKED') {
    // TODO
  }

  // * If it's an invalid stream level frame, emit error
  else if ((frame.type !== 'DATA') &&
           (frame.type !== 'WINDOW_UPDATE') &&
           (frame.type !== 'RST_STREAM')) {
    this._log.error({ frame: frame }, 'Invalid stream level frame');
    this.emit('error', 'PROTOCOL_ERROR');
  }

  return moreNeeded;
};

// The `_receive` method (= `upstream._receive`) gets called when there's an incoming frame.
Stream.prototype._receive = function _receive(frame, ready) {
  // * If it's a DATA frame, then push the payload into the output buffer on the other side.
  //   Call ready when the other side is ready to receive more.
  if (!this._ended && (frame.type === 'DATA')) {
    var moreNeeded = this.push(frame.data);
    if (!moreNeeded) {
      this._receiveMore = ready;
    }
  }

  // * Any frame may signal the end of the stream with the END_STREAM flag
  if (!this._ended && (frame.flags.END_STREAM || (frame.type === 'RST_STREAM'))) {
    this.push(null);
    this._ended = true;
  }

  // * Postpone calling `ready` if `push()` returned a falsy value
  if (this._receiveMore !== ready) {
    ready();
  }
};

// The `_read` method is called when the user side is ready to receive more data. If there's a
// pending write on the upstream, then call its pending ready callback to receive more frames.
Stream.prototype._read = function _read() {
  if (this._receiveMore) {
    var receiveMore = this._receiveMore;
    delete this._receiveMore;
    receiveMore();
  }
};

// The `write` method gets called when there's a write request from the user.
Stream.prototype._write = function _write(buffer, encoding, ready) {
  // * Chunking is done by the upstream Flow.
  var moreNeeded = this._pushUpstream({
    type: 'DATA',
    flags: {},
    stream: this.id,
    data: buffer
  });

  // * Call ready when upstream is ready to receive more frames.
  if (moreNeeded) {
    ready();
  } else {
    this._sendMore = ready;
  }
};

// The `_send` (= `upstream._send`) method is called when upstream is ready to receive more frames.
// If there's a pending write on the user side, then call its pending ready callback to receive more
// writes.
Stream.prototype._send = function _send() {
  if (this._sendMore) {
    var sendMore = this._sendMore;
    delete this._sendMore;
    sendMore();
  }
};

// When the stream is finishing (the user calls `end()` on it), then we have to set the `END_STREAM`
// flag on the last frame. If there's no frame in the queue, or if it doesn't support this flag,
// then we create a 0 length DATA frame. We could do this all the time, but putting the flag on an
// existing frame is a nice optimization.
var emptyBuffer = new Buffer(0);
Stream.prototype._finishing = function _finishing() {
  var endFrame = {
    type: 'DATA',
    flags: { END_STREAM: true },
    stream: this.id,
    data: emptyBuffer
  };
  var lastFrame = this.upstream.getLastQueuedFrame();
  if (lastFrame && ((lastFrame.type === 'DATA') || (lastFrame.type === 'HEADERS'))) {
    this._log.debug({ frame: lastFrame }, 'Marking last frame with END_STREAM flag.');
    lastFrame.flags.END_STREAM = true;
    this._transition(true, endFrame);
  } else {
    this._pushUpstream(endFrame);
  }
};

// [Stream States](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-5.1)
// ----------------
//
//                           +--------+
//                     PP    |        |    PP
//                  ,--------|  idle  |--------.
//                 /         |        |         \
//                v          +--------+          v
//         +----------+          |           +----------+
//         |          |          | H         |          |
//     ,---| reserved |          |           | reserved |---.
//     |   | (local)  |          v           | (remote) |   |
//     |   +----------+      +--------+      +----------+   |
//     |      |          ES  |        |  ES          |      |
//     |      | H    ,-------|  open  |-------.      | H    |
//     |      |     /        |        |        \     |      |
//     |      v    v         +--------+         v    v      |
//     |   +----------+          |           +----------+   |
//     |   |   half   |          |           |   half   |   |
//     |   |  closed  |          | R         |  closed  |   |
//     |   | (remote) |          |           | (local)  |   |
//     |   +----------+          |           +----------+   |
//     |        |                v                 |        |
//     |        |  ES / R    +--------+  ES / R    |        |
//     |        `----------->|        |<-----------'        |
//     |  R                  | closed |                  R  |
//     `-------------------->|        |<--------------------'
//                           +--------+

// Streams begin in the IDLE state and transitions happen when there's an incoming or outgoing frame
Stream.prototype._initializeState = function _initializeState() {
  this.state = 'IDLE';
  this._initiated = undefined;
  this._closedByUs = undefined;
  this._closedWithRst = undefined;
  this._processedHeaders = false;
};

// Only `_setState` should change `this.state` directly. It also logs the state change and notifies
// interested parties using the 'state' event.
Stream.prototype._setState = function transition(state) {
  assert(this.state !== state);
  this._log.debug({ from: this.state, to: state }, 'State transition');
  this.state = state;
  this.emit('state', state);
};

// A state is 'active' if the stream in that state counts towards the concurrency limit. Streams
// that are in the "open" state, or either of the "half closed" states count toward this limit.
function activeState(state) {
  return ((state === 'HALF_CLOSED_LOCAL') || (state === 'HALF_CLOSED_REMOTE') || (state === 'OPEN'));
}

// `_transition` is called every time there's an incoming or outgoing frame. It manages state
// transitions, and detects stream errors. A stream error is always caused by a frame that is not
// allowed in the current state.
Stream.prototype._transition = function transition(sending, frame) {
  var receiving = !sending;
  var connectionError;
  var streamError;

  var DATA = false, HEADERS = false, PRIORITY = false, ALTSVC = false, BLOCKED = false;
  var RST_STREAM = false, PUSH_PROMISE = false, WINDOW_UPDATE = false;
  switch(frame.type) {
    case 'DATA'         : DATA          = true; break;
    case 'HEADERS'      : HEADERS       = true; break;
    case 'PRIORITY'     : PRIORITY      = true; break;
    case 'RST_STREAM'   : RST_STREAM    = true; break;
    case 'PUSH_PROMISE' : PUSH_PROMISE  = true; break;
    case 'WINDOW_UPDATE': WINDOW_UPDATE = true; break;
    case 'ALTSVC'       : ALTSVC        = true; break;
    case 'BLOCKED'      : BLOCKED       = true; break;
  }

  var previousState = this.state;

  switch (this.state) {
    // All streams start in the **idle** state. In this state, no frames have been exchanged.
    //
    // * Sending or receiving a HEADERS frame causes the stream to become "open".
    //
    // When the HEADERS frame contains the END_STREAM flags, then two state transitions happen.
    case 'IDLE':
      if (HEADERS) {
        this._setState('OPEN');
        if (frame.flags.END_STREAM) {
          this._setState(sending ? 'HALF_CLOSED_LOCAL' : 'HALF_CLOSED_REMOTE');
        }
        this._initiated = sending;
      } else if (sending && RST_STREAM) {
        this._setState('CLOSED');
      } else if (PRIORITY) {
        /* No state change */
      } else {
        connectionError = 'PROTOCOL_ERROR';
      }
      break;

    // A stream in the **reserved (local)** state is one that has been promised by sending a
    // PUSH_PROMISE frame.
    //
    // * The endpoint can send a HEADERS frame. This causes the stream to open in a "half closed
    //   (remote)" state.
    // * Either endpoint can send a RST_STREAM frame to cause the stream to become "closed". This
    //   releases the stream reservation.
    // * An endpoint may receive PRIORITY frame in this state.
    // * An endpoint MUST NOT send any other type of frame in this state.
    case 'RESERVED_LOCAL':
      if (sending && HEADERS) {
        this._setState('HALF_CLOSED_REMOTE');
      } else if (RST_STREAM) {
        this._setState('CLOSED');
      } else if (PRIORITY) {
        /* No state change */
      } else {
        connectionError = 'PROTOCOL_ERROR';
      }
      break;

    // A stream in the **reserved (remote)** state has been reserved by a remote peer.
    //
    // * Either endpoint can send a RST_STREAM frame to cause the stream to become "closed". This
    //   releases the stream reservation.
    // * Receiving a HEADERS frame causes the stream to transition to "half closed (local)".
    // * An endpoint MAY send PRIORITY frames in this state to reprioritize the stream.
    // * Receiving any other type of frame MUST be treated as a stream error of type PROTOCOL_ERROR.
    case 'RESERVED_REMOTE':
      if (RST_STREAM) {
        this._setState('CLOSED');
      } else if (receiving && HEADERS) {
        this._setState('HALF_CLOSED_LOCAL');
      } else if (BLOCKED || PRIORITY) {
        /* No state change */
      } else {
        connectionError = 'PROTOCOL_ERROR';
      }
      break;

    // The **open** state is where both peers can send frames. In this state, sending peers observe
    // advertised stream level flow control limits.
    //
    // * From this state either endpoint can send a frame with a END_STREAM flag set, which causes
    //   the stream to transition into one of the "half closed" states: an endpoint sending a
    //   END_STREAM flag causes the stream state to become "half closed (local)"; an endpoint
    //   receiving a END_STREAM flag causes the stream state to become "half closed (remote)".
    // * Either endpoint can send a RST_STREAM frame from this state, causing it to transition
    //   immediately to "closed".
    case 'OPEN':
      if (frame.flags.END_STREAM) {
        this._setState(sending ? 'HALF_CLOSED_LOCAL' : 'HALF_CLOSED_REMOTE');
      } else if (RST_STREAM) {
        this._setState('CLOSED');
      } else {
        /* No state change */
      }
      break;

    // A stream that is **half closed (local)** cannot be used for sending frames.
    //
    // * A stream transitions from this state to "closed" when a frame that contains a END_STREAM
    //   flag is received, or when either peer sends a RST_STREAM frame.
    // * An endpoint MAY send or receive PRIORITY frames in this state to reprioritize the stream.
    // * WINDOW_UPDATE can be sent by a peer that has sent a frame bearing the END_STREAM flag.
    case 'HALF_CLOSED_LOCAL':
      if (RST_STREAM || (receiving && frame.flags.END_STREAM)) {
        this._setState('CLOSED');
      } else if (BLOCKED || ALTSVC || receiving || PRIORITY || (sending && WINDOW_UPDATE)) {
        /* No state change */
      } else {
        connectionError = 'PROTOCOL_ERROR';
      }
      break;

    // A stream that is **half closed (remote)** is no longer being used by the peer to send frames.
    // In this state, an endpoint is no longer obligated to maintain a receiver flow control window
    // if it performs flow control.
    //
    // * If an endpoint receives additional frames for a stream that is in this state it MUST
    //   respond with a stream error of type STREAM_CLOSED.
    // * A stream can transition from this state to "closed" by sending a frame that contains a
    //   END_STREAM flag, or when either peer sends a RST_STREAM frame.
    // * An endpoint MAY send or receive PRIORITY frames in this state to reprioritize the stream.
    // * A receiver MAY receive a WINDOW_UPDATE frame on a "half closed (remote)" stream.
    case 'HALF_CLOSED_REMOTE':
      if (RST_STREAM || (sending && frame.flags.END_STREAM)) {
        this._setState('CLOSED');
      } else if (BLOCKED || ALTSVC || sending || PRIORITY || (receiving && WINDOW_UPDATE)) {
        /* No state change */
      } else {
        connectionError = 'PROTOCOL_ERROR';
      }
      break;

    // The **closed** state is the terminal state.
    //
    // * An endpoint MUST NOT send frames on a closed stream. An endpoint that receives a frame
    //   after receiving a RST_STREAM or a frame containing a END_STREAM flag on that stream MUST
    //   treat that as a stream error of type STREAM_CLOSED.
    // * WINDOW_UPDATE, PRIORITY or RST_STREAM frames can be received in this state for a short
    //   period after a frame containing an END_STREAM flag is sent.  Until the remote peer receives
    //   and processes the frame bearing the END_STREAM flag, it might send either frame type.
    //   Endpoints MUST ignore WINDOW_UPDATE frames received in this state, though endpoints MAY
    //   choose to treat WINDOW_UPDATE frames that arrive a significant time after sending
    //   END_STREAM as a connection error of type PROTOCOL_ERROR.
    // * If this state is reached as a result of sending a RST_STREAM frame, the peer that receives
    //   the RST_STREAM might have already sent - or enqueued for sending - frames on the stream
    //   that cannot be withdrawn. An endpoint that sends a RST_STREAM frame MUST ignore frames that
    //   it receives on closed streams after it has sent a RST_STREAM frame. An endpoint MAY choose
    //   to limit the period over which it ignores frames and treat frames that arrive after this
    //   time as being in error.
    // * An endpoint might receive a PUSH_PROMISE frame after it sends RST_STREAM. PUSH_PROMISE
    //   causes a stream to become "reserved". If promised streams are not desired, a RST_STREAM
    //   can be used to close any of those streams.
    case 'CLOSED':
      if (PRIORITY || (sending && RST_STREAM) ||
          (receiving && this._closedByUs &&
           (this._closedWithRst || WINDOW_UPDATE || RST_STREAM || ALTSVC))) {
        /* No state change */
      } else {
        streamError = 'STREAM_CLOSED';
      }
      break;
  }

  // Noting that the connection was closed by the other endpoint. It may be important in edge cases.
  // For example, when the peer tries to cancel a promised stream, but we already sent every data
  // on it, then the stream is in CLOSED state, yet we want to ignore the incoming RST_STREAM.
  if ((this.state === 'CLOSED') && (previousState !== 'CLOSED')) {
    this._closedByUs = sending;
    this._closedWithRst = RST_STREAM;
  }

  // Sending/receiving a PUSH_PROMISE
  //
  // * Sending a PUSH_PROMISE frame marks the associated stream for later use. The stream state
  //   for the reserved stream transitions to "reserved (local)".
  // * Receiving a PUSH_PROMISE frame marks the associated stream as reserved by the remote peer.
  //   The state of the stream becomes "reserved (remote)".
  if (PUSH_PROMISE && !connectionError && !streamError) {
    /* This assertion must hold, because _transition is called immediately when a frame is written
       to the stream. If it would be called when a frame gets out of the input queue, the state
       of the reserved could have been changed by then. */
    assert(frame.promised_stream.state === 'IDLE', frame.promised_stream.state);
    frame.promised_stream._setState(sending ? 'RESERVED_LOCAL' : 'RESERVED_REMOTE');
    frame.promised_stream._initiated = sending;
  }

  // Signaling how sending/receiving this frame changes the active stream count (-1, 0 or +1)
  if (this._initiated) {
    var change = (activeState(this.state) - activeState(previousState));
    if (sending) {
      frame.count_change = change;
    } else {
      frame.count_change(change);
    }
  } else if (sending) {
    frame.count_change = 0;
  }

  // Common error handling.
  if (connectionError || streamError) {
    var info = {
      error: connectionError,
      frame: frame,
      state: this.state,
      closedByUs: this._closedByUs,
      closedWithRst: this._closedWithRst
    };

    // * When sending something invalid, throwing an exception, since it is probably a bug.
    if (sending) {
      this._log.error(info, 'Sending illegal frame.');
      throw new Error('Sending illegal frame (' + frame.type + ') in ' + this.state + ' state.');
    }

    // * In case of a serious problem, emitting and error and letting someone else handle it
    //   (e.g. closing the connection)
    // * When receiving something invalid, sending an RST_STREAM using the `reset` method.
    //   This will automatically cause a transition to the CLOSED state.
    else {
      this._log.error(info, 'Received illegal frame.');
      if (connectionError) {
        this.emit('connectionError', connectionError);
      } else {
        this.reset(streamError);
        this.emit('error', streamError);
      }
    }
  }
};

// Bunyan serializers
// ------------------

exports.serializers = {};

var nextId = 0;
exports.serializers.s = function(stream) {
  if (!('_id' in stream)) {
    stream._id = nextId;
    nextId += 1;
  }
  return stream._id;
};
