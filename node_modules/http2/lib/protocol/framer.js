// The framer consists of two [Transform Stream][1] subclasses that operate in [object mode][2]:
// the Serializer and the Deserializer
// [1]: http://nodejs.org/api/stream.html#stream_class_stream_transform
// [2]: http://nodejs.org/api/stream.html#stream_new_stream_readable_options
var assert = require('assert');

var Transform = require('stream').Transform;

exports.Serializer = Serializer;
exports.Deserializer = Deserializer;

var logData = Boolean(process.env.HTTP2_LOG_DATA);

var MAX_PAYLOAD_SIZE = 16384;
var WINDOW_UPDATE_PAYLOAD_SIZE = 4;

// Serializer
// ----------
//
//     Frame Objects
//     * * * * * * * --+---------------------------
//                     |                          |
//                     v                          v           Buffers
//      [] -----> Payload Ser. --[buffers]--> Header Ser. --> * * * *
//     empty      adds payload                adds header
//     array        buffers                     buffer

function Serializer(log) {
  this._log = log.child({ component: 'serializer' });
  Transform.call(this, { objectMode: true });
}
Serializer.prototype = Object.create(Transform.prototype, { constructor: { value: Serializer } });

// When there's an incoming frame object, it first generates the frame type specific part of the
// frame (payload), and then then adds the header part which holds fields that are common to all
// frame types (like the length of the payload).
Serializer.prototype._transform = function _transform(frame, encoding, done) {
  this._log.trace({ frame: frame }, 'Outgoing frame');

  assert(frame.type in Serializer, 'Unknown frame type: ' + frame.type);

  var buffers = [];
  Serializer[frame.type](frame, buffers);
  var length = Serializer.commonHeader(frame, buffers);

  assert(length <= MAX_PAYLOAD_SIZE, 'Frame too large!');

  for (var i = 0; i < buffers.length; i++) {
    if (logData) {
      this._log.trace({ data: buffers[i] }, 'Outgoing data');
    }
    this.push(buffers[i]);
  }

  done();
};

// Deserializer
// ------------
//
//     Buffers
//     * * * * --------+-------------------------
//                     |                        |
//                     v                        v           Frame Objects
//      {} -----> Header Des. --{frame}--> Payload Des. --> * * * * * * *
//     empty      adds parsed              adds parsed
//     object  header properties        payload properties

function Deserializer(log, role) {
  this._role = role;
  this._log = log.child({ component: 'deserializer' });
  Transform.call(this, { objectMode: true });
  this._next(COMMON_HEADER_SIZE);
}
Deserializer.prototype = Object.create(Transform.prototype, { constructor: { value: Deserializer } });

// The Deserializer is stateful, and it's two main alternating states are: *waiting for header* and
// *waiting for payload*. The state is stored in the boolean property `_waitingForHeader`.
//
// When entering a new state, a `_buffer` is created that will hold the accumulated data (header or
// payload). The `_cursor` is used to track the progress.
Deserializer.prototype._next = function(size) {
  this._cursor = 0;
  this._buffer = new Buffer(size);
  this._waitingForHeader = !this._waitingForHeader;
  if (this._waitingForHeader) {
    this._frame = {};
  }
};

// Parsing an incoming buffer is an iterative process because it can hold multiple frames if it's
// large enough. A `cursor` is used to track the progress in parsing the incoming `chunk`.
Deserializer.prototype._transform = function _transform(chunk, encoding, done) {
  var cursor = 0;

  if (logData) {
    this._log.trace({ data: chunk }, 'Incoming data');
  }

  while(cursor < chunk.length) {
    // The content of an incoming buffer is first copied to `_buffer`. If it can't hold the full
    // chunk, then only a part of it is copied.
    var toCopy = Math.min(chunk.length - cursor, this._buffer.length - this._cursor);
    chunk.copy(this._buffer, this._cursor, cursor, cursor + toCopy);
    this._cursor += toCopy;
    cursor += toCopy;

    // When `_buffer` is full, it's content gets parsed either as header or payload depending on
    // the actual state.

    // If it's header then the parsed data is stored in a temporary variable and then the
    // deserializer waits for the specified length payload.
    if ((this._cursor === this._buffer.length) && this._waitingForHeader) {
      var payloadSize = Deserializer.commonHeader(this._buffer, this._frame);
      if (payloadSize <= MAX_PAYLOAD_SIZE) {
        this._next(payloadSize);
      } else {
        this.emit('error', 'FRAME_SIZE_ERROR');
        return;
      }
    }

    // If it's payload then the the frame object is finalized and then gets pushed out.
    // Unknown frame types are ignored.
    //
    // Note: If we just finished the parsing of a header and the payload length is 0, this branch
    // will also run.
    if ((this._cursor === this._buffer.length) && !this._waitingForHeader) {
      if (this._frame.type) {
        var error = Deserializer[this._frame.type](this._buffer, this._frame, this._role);
        if (error) {
          this._log.error('Incoming frame parsing error: ' + error);
          this.emit('error', error);
        } else {
          this._log.trace({ frame: this._frame }, 'Incoming frame');
          this.push(this._frame);
        }
      } else {
        this._log.error('Unknown type incoming frame');
        // Ignore it other than logging
      }
      this._next(COMMON_HEADER_SIZE);
    }
  }

  done();
};

// [Frame Header](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-4.1)
// --------------------------------------------------------------
//
// HTTP/2.0 frames share a common base format consisting of a 9-byte header followed by 0 to 2^24 - 1
// bytes of data.
//
// Additional size limits can be set by specific application uses. HTTP limits the frame size to
// 16,384 octets by default, though this can be increased by a receiver.
//
//      0                   1                   2                   3
//      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
//     +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
//     |                 Length (24)                   |
//     +---------------+---------------+---------------+
//     |   Type (8)    |   Flags (8)   |
//     +-+-----------------------------+---------------+---------------+
//     |R|                 Stream Identifier (31)                      |
//     +-+-------------------------------------------------------------+
//     |                     Frame Data (0...)                       ...
//     +---------------------------------------------------------------+
//
// The fields of the frame header are defined as:
//
// * Length:
//   The length of the frame data expressed as an unsigned 24-bit integer. The 9 bytes of the frame
//   header are not included in this value.
//
// * Type:
//   The 8-bit type of the frame. The frame type determines how the remainder of the frame header
//   and data are interpreted. Implementations MUST ignore unsupported and unrecognized frame types.
//
// * Flags:
//   An 8-bit field reserved for frame-type specific boolean flags.
//
//   Flags are assigned semantics specific to the indicated frame type. Flags that have no defined
//   semantics for a particular frame type MUST be ignored, and MUST be left unset (0) when sending.
//
// * R:
//   A reserved 1-bit field. The semantics of this bit are undefined and the bit MUST remain unset
//   (0) when sending and MUST be ignored when receiving.
//
// * Stream Identifier:
//   A 31-bit stream identifier. The value 0 is reserved for frames that are associated with the
//   connection as a whole as opposed to an individual stream.
//
// The structure and content of the remaining frame data is dependent entirely on the frame type.

var COMMON_HEADER_SIZE = 9;

var frameTypes = [];

var frameFlags = {};

var genericAttributes = ['type', 'flags', 'stream'];

var typeSpecificAttributes = {};

Serializer.commonHeader = function writeCommonHeader(frame, buffers) {
  var headerBuffer = new Buffer(COMMON_HEADER_SIZE);

  var size = 0;
  for (var i = 0; i < buffers.length; i++) {
    size += buffers[i].length;
  }
  headerBuffer.writeUInt8(0, 0);
  headerBuffer.writeUInt16BE(size, 1);

  var typeId = frameTypes.indexOf(frame.type);  // If we are here then the type is valid for sure
  headerBuffer.writeUInt8(typeId, 3);

  var flagByte = 0;
  for (var flag in frame.flags) {
    var position = frameFlags[frame.type].indexOf(flag);
    assert(position !== -1, 'Unknown flag for frame type ' + frame.type + ': ' + flag);
    if (frame.flags[flag]) {
      flagByte |= (1 << position);
    }
  }
  headerBuffer.writeUInt8(flagByte, 4);

  assert((0 <= frame.stream) && (frame.stream < 0x7fffffff), frame.stream);
  headerBuffer.writeUInt32BE(frame.stream || 0, 5);

  buffers.unshift(headerBuffer);

  return size;
};

Deserializer.commonHeader = function readCommonHeader(buffer, frame) {
  if (buffer.length < 9) {
    return 'FRAME_SIZE_ERROR';
  }

  var totallyWastedByte = buffer.readUInt8(0);
  var length = buffer.readUInt16BE(1);
  // We do this just for sanity checking later on, to make sure no one sent us a
  // frame that's super large.
  length += totallyWastedByte << 16;

  frame.type = frameTypes[buffer.readUInt8(3)];
  if (!frame.type) {
    // We are required to ignore unknown frame types
    return length;
  }

  frame.flags = {};
  var flagByte = buffer.readUInt8(4);
  var definedFlags = frameFlags[frame.type];
  for (var i = 0; i < definedFlags.length; i++) {
    frame.flags[definedFlags[i]] = Boolean(flagByte & (1 << i));
  }

  frame.stream = buffer.readUInt32BE(5) & 0x7fffffff;

  return length;
};

// Frame types
// ===========

// Every frame type is registered in the following places:
//
// * `frameTypes`: a register of frame type codes (used by `commonHeader()`)
// * `frameFlags`: a register of valid flags for frame types (used by `commonHeader()`)
// * `typeSpecificAttributes`: a register of frame specific frame object attributes (used by
//   logging code and also serves as documentation for frame objects)

// [DATA Frames](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-6.1)
// ------------------------------------------------------------
//
// DATA frames (type=0x0) convey arbitrary, variable-length sequences of octets associated with a
// stream.
//
// The DATA frame defines the following flags:
//
// * END_STREAM (0x1):
//   Bit 1 being set indicates that this frame is the last that the endpoint will send for the
//   identified stream.
// * PADDED (0x08):
//   Bit 4 being set indicates that the Pad Length field is present.

frameTypes[0x0] = 'DATA';

frameFlags.DATA = ['END_STREAM', 'RESERVED2', 'RESERVED4', 'PADDED'];

typeSpecificAttributes.DATA = ['data'];

Serializer.DATA = function writeData(frame, buffers) {
  buffers.push(frame.data);
};

Deserializer.DATA = function readData(buffer, frame) {
  var dataOffset = 0;
  var paddingLength = 0;
  if (frame.flags.PADDED) {
    if (buffer.length < 1) {
      // We must have at least one byte for padding control, but we don't. Bad peer!
      return 'FRAME_SIZE_ERROR';
    }
    paddingLength = (buffer.readUInt8(dataOffset) & 0xff);
    dataOffset = 1;
  }

  if (paddingLength) {
    if (paddingLength >= (buffer.length - 1)) {
      // We don't have enough room for the padding advertised - bad peer!
      return 'FRAME_SIZE_ERROR';
    }
    frame.data = buffer.slice(dataOffset, -1 * paddingLength);
  } else {
    frame.data = buffer.slice(dataOffset);
  }
};

// [HEADERS](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-6.2)
// --------------------------------------------------------------
//
// The HEADERS frame (type=0x1) allows the sender to create a stream.
//
// The HEADERS frame defines the following flags:
//
// * END_STREAM (0x1):
//   Bit 1 being set indicates that this frame is the last that the endpoint will send for the
//   identified stream.
// * END_HEADERS (0x4):
//   The END_HEADERS bit indicates that this frame contains the entire payload necessary to provide
//   a complete set of headers.
// * PADDED (0x08):
//   Bit 4 being set indicates that the Pad Length field is present.
// * PRIORITY (0x20):
//   Bit 6 being set indicates that the Exlusive Flag (E), Stream Dependency, and Weight fields are
//   present.

frameTypes[0x1] = 'HEADERS';

frameFlags.HEADERS = ['END_STREAM', 'RESERVED2', 'END_HEADERS', 'PADDED', 'RESERVED5', 'PRIORITY'];

typeSpecificAttributes.HEADERS = ['priorityDependency', 'priorityWeight', 'exclusiveDependency', 'headers', 'data'];

//      0                   1                   2                   3
//      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
//     +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
//     |Pad Length? (8)|
//     +-+-------------+---------------+-------------------------------+
//     |E|                 Stream Dependency? (31)                     |
//     +-+-------------+-----------------------------------------------+
//     |  Weight? (8)  |
//     +-+-------------+-----------------------------------------------+
//     |                   Header Block Fragment (*)                 ...
//     +---------------------------------------------------------------+
//     |                           Padding (*)                       ...
//     +---------------------------------------------------------------+
//
// The payload of a HEADERS frame contains a Headers Block

Serializer.HEADERS = function writeHeadersPriority(frame, buffers) {
  if (frame.flags.PRIORITY) {
    var buffer = new Buffer(5);
    assert((0 <= frame.priorityDependency) && (frame.priorityDependency <= 0x7fffffff), frame.priorityDependency);
    buffer.writeUInt32BE(frame.priorityDependency, 0);
    if (frame.exclusiveDependency) {
      buffer[0] |= 0x80;
    }
    assert((0 <= frame.priorityWeight) && (frame.priorityWeight <= 0xff), frame.priorityWeight);
    buffer.writeUInt8(frame.priorityWeight, 4);
    buffers.push(buffer);
  }
  buffers.push(frame.data);
};

Deserializer.HEADERS = function readHeadersPriority(buffer, frame) {
  var minFrameLength = 0;
  if (frame.flags.PADDED) {
    minFrameLength += 1;
  }
  if (frame.flags.PRIORITY) {
    minFrameLength += 5;
  }
  if (buffer.length < minFrameLength) {
    // Peer didn't send enough data - bad peer!
    return 'FRAME_SIZE_ERROR';
  }

  var dataOffset = 0;
  var paddingLength = 0;
  if (frame.flags.PADDED) {
    paddingLength = (buffer.readUInt8(dataOffset) & 0xff);
    dataOffset = 1;
  }

  if (frame.flags.PRIORITY) {
    var dependencyData = new Buffer(4);
    buffer.copy(dependencyData, 0, dataOffset, dataOffset + 4);
    dataOffset += 4;
    frame.exclusiveDependency = !!(dependencyData[0] & 0x80);
    dependencyData[0] &= 0x7f;
    frame.priorityDependency = dependencyData.readUInt32BE(0);
    frame.priorityWeight = buffer.readUInt8(dataOffset);
    dataOffset += 1;
  }

  if (paddingLength) {
    if ((buffer.length - dataOffset) < paddingLength) {
      // Not enough data left to satisfy the advertised padding - bad peer!
      return 'FRAME_SIZE_ERROR';
    }
    frame.data = buffer.slice(dataOffset, -1 * paddingLength);
  } else {
    frame.data = buffer.slice(dataOffset);
  }
};

// [PRIORITY](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-6.3)
// -------------------------------------------------------
//
// The PRIORITY frame (type=0x2) specifies the sender-advised priority of a stream.
//
// The PRIORITY frame does not define any flags.

frameTypes[0x2] = 'PRIORITY';

frameFlags.PRIORITY = [];

typeSpecificAttributes.PRIORITY = ['priorityDependency', 'priorityWeight', 'exclusiveDependency'];

//      0                   1                   2                   3
//      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
//     +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
//     |E|                 Stream Dependency? (31)                     |
//     +-+-------------+-----------------------------------------------+
//     |  Weight? (8)  |
//     +-+-------------+
//
// The payload of a PRIORITY frame contains an exclusive bit, a 31-bit dependency, and an 8-bit weight

Serializer.PRIORITY = function writePriority(frame, buffers) {
  var buffer = new Buffer(5);
  assert((0 <= frame.priorityDependency) && (frame.priorityDependency <= 0x7fffffff), frame.priorityDependency);
  buffer.writeUInt32BE(frame.priorityDependency, 0);
  if (frame.exclusiveDependency) {
    buffer[0] |= 0x80;
  }
  assert((0 <= frame.priorityWeight) && (frame.priorityWeight <= 0xff), frame.priorityWeight);
  buffer.writeUInt8(frame.priorityWeight, 4);

  buffers.push(buffer);
};

Deserializer.PRIORITY = function readPriority(buffer, frame) {
  if (buffer.length < 5) {
    // PRIORITY frames are 5 bytes long. Bad peer!
    return 'FRAME_SIZE_ERROR';
  }
  var dependencyData = new Buffer(4);
  buffer.copy(dependencyData, 0, 0, 4);
  frame.exclusiveDependency = !!(dependencyData[0] & 0x80);
  dependencyData[0] &= 0x7f;
  frame.priorityDependency = dependencyData.readUInt32BE(0);
  frame.priorityWeight = buffer.readUInt8(4);
};

// [RST_STREAM](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-6.4)
// -----------------------------------------------------------
//
// The RST_STREAM frame (type=0x3) allows for abnormal termination of a stream.
//
// No type-flags are defined.

frameTypes[0x3] = 'RST_STREAM';

frameFlags.RST_STREAM = [];

typeSpecificAttributes.RST_STREAM = ['error'];

//      0                   1                   2                   3
//      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
//     +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
//     |                         Error Code (32)                       |
//     +---------------------------------------------------------------+
//
// The RST_STREAM frame contains a single unsigned, 32-bit integer identifying the error
// code (see Error Codes). The error code indicates why the stream is being terminated.

Serializer.RST_STREAM = function writeRstStream(frame, buffers) {
  var buffer = new Buffer(4);
  var code = errorCodes.indexOf(frame.error);
  assert((0 <= code) && (code <= 0xffffffff), code);
  buffer.writeUInt32BE(code, 0);
  buffers.push(buffer);
};

Deserializer.RST_STREAM = function readRstStream(buffer, frame) {
  if (buffer.length < 4) {
    // RST_STREAM is 4 bytes long. Bad peer!
    return 'FRAME_SIZE_ERROR';
  }
  frame.error = errorCodes[buffer.readUInt32BE(0)];
  if (!frame.error) {
    // Unknown error codes are considered equivalent to INTERNAL_ERROR
    frame.error = 'INTERNAL_ERROR';
  }
};

// [SETTINGS](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-6.5)
// -------------------------------------------------------
//
// The SETTINGS frame (type=0x4) conveys configuration parameters that affect how endpoints
// communicate.
//
// The SETTINGS frame defines the following flag:

// * ACK (0x1):
//   Bit 1 being set indicates that this frame acknowledges receipt and application of the peer's
//   SETTINGS frame.
frameTypes[0x4] = 'SETTINGS';

frameFlags.SETTINGS = ['ACK'];

typeSpecificAttributes.SETTINGS = ['settings'];

// The payload of a SETTINGS frame consists of zero or more settings. Each setting consists of a
// 16-bit identifier, and an unsigned 32-bit value.
//
//      0                   1                   2                   3
//      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
//     +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
//     |         Identifier(16)          |        Value (32)           |
//     +-----------------+---------------------------------------------+
//     ...Value                          |
//     +---------------------------------+
//
// Each setting in a SETTINGS frame replaces the existing value for that setting.  Settings are
// processed in the order in which they appear, and a receiver of a SETTINGS frame does not need to
// maintain any state other than the current value of settings.  Therefore, the value of a setting
// is the last value that is seen by a receiver. This permits the inclusion of the same settings
// multiple times in the same SETTINGS frame, though doing so does nothing other than waste
// connection capacity.

Serializer.SETTINGS = function writeSettings(frame, buffers) {
  var settings = [], settingsLeft = Object.keys(frame.settings);
  definedSettings.forEach(function(setting, id) {
    if (setting.name in frame.settings) {
      settingsLeft.splice(settingsLeft.indexOf(setting.name), 1);
      var value = frame.settings[setting.name];
      settings.push({ id: id, value: setting.flag ? Boolean(value) : value });
    }
  });
  assert(settingsLeft.length === 0, 'Unknown settings: ' + settingsLeft.join(', '));

  var buffer = new Buffer(settings.length * 6);
  for (var i = 0; i < settings.length; i++) {
    buffer.writeUInt16BE(settings[i].id & 0xffff, i*6);
    buffer.writeUInt32BE(settings[i].value, i*6 + 2);
  }

  buffers.push(buffer);
};

Deserializer.SETTINGS = function readSettings(buffer, frame, role) {
  frame.settings = {};

  // Receipt of a SETTINGS frame with the ACK flag set and a length
  // field value other than 0 MUST be treated as a connection error
  // (Section 5.4.1) of type FRAME_SIZE_ERROR.
  if(frame.flags.ACK && buffer.length != 0) {
    return 'FRAME_SIZE_ERROR';
  }

  if (buffer.length % 6 !== 0) {
    return 'PROTOCOL_ERROR';
  }
  for (var i = 0; i < buffer.length / 6; i++) {
    var id = buffer.readUInt16BE(i*6) & 0xffff;
    var setting = definedSettings[id];
    if (setting) {
      if (role == 'CLIENT' && setting.name == 'SETTINGS_ENABLE_PUSH') {
        return 'SETTINGS frame on client got SETTINGS_ENABLE_PUSH';
      }
      var value = buffer.readUInt32BE(i*6 + 2);
      frame.settings[setting.name] = setting.flag ? Boolean(value & 0x1) : value;
    }
  }
};

// The following settings are defined:
var definedSettings = [];

// * SETTINGS_HEADER_TABLE_SIZE (1):
//   Allows the sender to inform the remote endpoint of the size of the header compression table
//   used to decode header blocks.
definedSettings[1] = { name: 'SETTINGS_HEADER_TABLE_SIZE', flag: false };

// * SETTINGS_ENABLE_PUSH (2):
//   This setting can be use to disable server push. An endpoint MUST NOT send a PUSH_PROMISE frame
//   if it receives this setting set to a value of 0. The default value is 1, which indicates that
//   push is permitted.
definedSettings[2] = { name: 'SETTINGS_ENABLE_PUSH', flag: true };

// * SETTINGS_MAX_CONCURRENT_STREAMS (3):
//   indicates the maximum number of concurrent streams that the sender will allow.
definedSettings[3] = { name: 'SETTINGS_MAX_CONCURRENT_STREAMS', flag: false };

// * SETTINGS_INITIAL_WINDOW_SIZE (4):
//   indicates the sender's initial stream window size (in bytes) for new streams.
definedSettings[4] = { name: 'SETTINGS_INITIAL_WINDOW_SIZE', flag: false };

// * SETTINGS_MAX_FRAME_SIZE (5):
//   indicates the maximum size of a frame the receiver will allow.
definedSettings[5] = { name: 'SETTINGS_MAX_FRAME_SIZE', flag: false };

// [PUSH_PROMISE](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-6.6)
// ---------------------------------------------------------------
//
// The PUSH_PROMISE frame (type=0x5) is used to notify the peer endpoint in advance of streams the
// sender intends to initiate.
//
// The PUSH_PROMISE frame defines the following flags:
//
// * END_PUSH_PROMISE (0x4):
//   The END_PUSH_PROMISE bit indicates that this frame contains the entire payload necessary to
//   provide a complete set of headers.

frameTypes[0x5] = 'PUSH_PROMISE';

frameFlags.PUSH_PROMISE = ['RESERVED1', 'RESERVED2', 'END_PUSH_PROMISE', 'PADDED'];

typeSpecificAttributes.PUSH_PROMISE = ['promised_stream', 'headers', 'data'];

//      0                   1                   2                   3
//      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
//     +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
//     |Pad Length? (8)|
//     +-+-------------+-----------------------------------------------+
//     |X|                Promised-Stream-ID (31)                      |
//     +-+-------------------------------------------------------------+
//     |                 Header Block Fragment (*)                   ...
//     +---------------------------------------------------------------+
//     |                         Padding (*)                         ...
//     +---------------------------------------------------------------+
//
// The PUSH_PROMISE frame includes the unsigned 31-bit identifier of
// the stream the endpoint plans to create along with a minimal set of headers that provide
// additional context for the stream.

Serializer.PUSH_PROMISE = function writePushPromise(frame, buffers) {
  var buffer = new Buffer(4);

  var promised_stream = frame.promised_stream;
  assert((0 <= promised_stream) && (promised_stream <= 0x7fffffff), promised_stream);
  buffer.writeUInt32BE(promised_stream, 0);

  buffers.push(buffer);
  buffers.push(frame.data);
};

Deserializer.PUSH_PROMISE = function readPushPromise(buffer, frame) {
  if (buffer.length < 4) {
    return 'FRAME_SIZE_ERROR';
  }
  var dataOffset = 0;
  var paddingLength = 0;
  if (frame.flags.PADDED) {
    if (buffer.length < 5) {
      return 'FRAME_SIZE_ERROR';
    }
    paddingLength = (buffer.readUInt8(dataOffset) & 0xff);
    dataOffset = 1;
  }
  frame.promised_stream = buffer.readUInt32BE(dataOffset) & 0x7fffffff;
  dataOffset += 4;
  if (paddingLength) {
    if ((buffer.length - dataOffset) < paddingLength) {
      return 'FRAME_SIZE_ERROR';
    }
    frame.data = buffer.slice(dataOffset, -1 * paddingLength);
  } else {
    frame.data = buffer.slice(dataOffset);
  }
};

// [PING](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-6.7)
// -----------------------------------------------
//
// The PING frame (type=0x6) is a mechanism for measuring a minimal round-trip time from the
// sender, as well as determining whether an idle connection is still functional.
//
// The PING frame defines one type-specific flag:
//
// * ACK (0x1):
//   Bit 1 being set indicates that this PING frame is a PING response.

frameTypes[0x6] = 'PING';

frameFlags.PING = ['ACK'];

typeSpecificAttributes.PING = ['data'];

// In addition to the frame header, PING frames MUST contain 8 additional octets of opaque data.

Serializer.PING = function writePing(frame, buffers) {
  buffers.push(frame.data);
};

Deserializer.PING = function readPing(buffer, frame) {
  if (buffer.length !== 8) {
    return 'FRAME_SIZE_ERROR';
  }
  frame.data = buffer;
};

// [GOAWAY](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-6.8)
// ---------------------------------------------------
//
// The GOAWAY frame (type=0x7) informs the remote peer to stop creating streams on this connection.
//
// The GOAWAY frame does not define any flags.

frameTypes[0x7] = 'GOAWAY';

frameFlags.GOAWAY = [];

typeSpecificAttributes.GOAWAY = ['last_stream', 'error'];

//      0                   1                   2                   3
//      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
//     +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
//     |X|                  Last-Stream-ID (31)                        |
//     +-+-------------------------------------------------------------+
//     |                      Error Code (32)                          |
//     +---------------------------------------------------------------+
//
// The last stream identifier in the GOAWAY frame contains the highest numbered stream identifier
// for which the sender of the GOAWAY frame has received frames on and might have taken some action
// on.
//
// The GOAWAY frame also contains a 32-bit error code (see Error Codes) that contains the reason for
// closing the connection.

Serializer.GOAWAY = function writeGoaway(frame, buffers) {
  var buffer = new Buffer(8);

  var last_stream = frame.last_stream;
  assert((0 <= last_stream) && (last_stream <= 0x7fffffff), last_stream);
  buffer.writeUInt32BE(last_stream, 0);

  var code = errorCodes.indexOf(frame.error);
  assert((0 <= code) && (code <= 0xffffffff), code);
  buffer.writeUInt32BE(code, 4);

  buffers.push(buffer);
};

Deserializer.GOAWAY = function readGoaway(buffer, frame) {
  if (buffer.length !== 8) {
    // GOAWAY must have 8 bytes
    return 'FRAME_SIZE_ERROR';
  }
  frame.last_stream = buffer.readUInt32BE(0) & 0x7fffffff;
  frame.error = errorCodes[buffer.readUInt32BE(4)];
  if (!frame.error) {
    // Unknown error types are to be considered equivalent to INTERNAL ERROR
    frame.error = 'INTERNAL_ERROR';
  }
};

// [WINDOW_UPDATE](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-6.9)
// -----------------------------------------------------------------
//
// The WINDOW_UPDATE frame (type=0x8) is used to implement flow control.
//
// The WINDOW_UPDATE frame does not define any flags.

frameTypes[0x8] = 'WINDOW_UPDATE';

frameFlags.WINDOW_UPDATE = [];

typeSpecificAttributes.WINDOW_UPDATE = ['window_size'];

// The payload of a WINDOW_UPDATE frame is a 32-bit value indicating the additional number of bytes
// that the sender can transmit in addition to the existing flow control window. The legal range
// for this field is 1 to 2^31 - 1 (0x7fffffff) bytes; the most significant bit of this value is
// reserved.

Serializer.WINDOW_UPDATE = function writeWindowUpdate(frame, buffers) {
  var buffer = new Buffer(4);

  var window_size = frame.window_size;
  assert((0 < window_size) && (window_size <= 0x7fffffff), window_size);
  buffer.writeUInt32BE(window_size, 0);

  buffers.push(buffer);
};

Deserializer.WINDOW_UPDATE = function readWindowUpdate(buffer, frame) {
  if (buffer.length !== WINDOW_UPDATE_PAYLOAD_SIZE) {
    return 'FRAME_SIZE_ERROR';
  }
  frame.window_size = buffer.readUInt32BE(0) & 0x7fffffff;
  if (frame.window_size === 0) {
    return 'PROTOCOL_ERROR';
  }
};

// [CONTINUATION](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-6.10)
// ------------------------------------------------------------
//
// The CONTINUATION frame (type=0x9) is used to continue a sequence of header block fragments.
//
// The CONTINUATION frame defines the following flag:
//
// * END_HEADERS (0x4):
//   The END_HEADERS bit indicates that this frame ends the sequence of header block fragments
//   necessary to provide a complete set of headers.

frameTypes[0x9] = 'CONTINUATION';

frameFlags.CONTINUATION = ['RESERVED1', 'RESERVED2', 'END_HEADERS'];

typeSpecificAttributes.CONTINUATION = ['headers', 'data'];

Serializer.CONTINUATION = function writeContinuation(frame, buffers) {
  buffers.push(frame.data);
};

Deserializer.CONTINUATION = function readContinuation(buffer, frame) {
  frame.data = buffer;
};

// [ALTSVC](http://tools.ietf.org/html/draft-ietf-httpbis-alt-svc-06#section-4)
// ------------------------------------------------------------
//
// The ALTSVC frame (type=0xA) advertises the availability of an alternative service to the client.
//
// The ALTSVC frame does not define any flags.

frameTypes[0xA] = 'ALTSVC';

frameFlags.ALTSVC = [];

//     0                   1                   2                   3
//     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
//    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
//    |         Origin-Len (16)       | Origin? (*)                 ...
//    +-------------------------------+----------------+--------------+
//    |                   Alt-Svc-Field-Value (*)                   ...
//    +---------------------------------------------------------------+
//
// The ALTSVC frame contains the following fields:
//
// Origin-Len: An unsigned, 16-bit integer indicating the length, in
//    octets, of the Origin field.
//
// Origin: An OPTIONAL sequence of characters containing ASCII
//    serialisation of an origin ([RFC6454](http://tools.ietf.org/html/rfc6454),
//    Section 6.2) that the alternate service is applicable to.
//
// Alt-Svc-Field-Value: A sequence of octets (length determined by
//    subtracting the length of all preceding fields from the frame
//    length) containing a value identical to the Alt-Svc field value
//    defined in (Section 3)[http://tools.ietf.org/html/draft-ietf-httpbis-alt-svc-06#section-3]
//    (ABNF production "Alt-Svc").

typeSpecificAttributes.ALTSVC = ['maxAge', 'port', 'protocolID', 'host',
                                 'origin'];

function istchar(c) {
  return ('!#$&\'*+-.^_`|~1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(c) > -1);
}

function hexencode(s) {
  var t = '';
  for (var i = 0; i < s.length; i++) {
    if (!istchar(s[i])) {
      t += '%';
      t += new Buffer(s[i]).toString('hex');
    } else {
      t += s[i];
    }
  }
  return t;
}

Serializer.ALTSVC = function writeAltSvc(frame, buffers) {
  var buffer = new Buffer(2);
  buffer.writeUInt16BE(frame.origin.length, 0);
  buffers.push(buffer);
  buffers.push(new Buffer(frame.origin, 'ascii'));

  var fieldValue = hexencode(frame.protocolID) + '="' + frame.host + ':' + frame.port + '"';
  if (frame.maxAge !== 86400) { // 86400 is the default
    fieldValue += "; ma=" + frame.maxAge;
  }

  buffers.push(new Buffer(fieldValue, 'ascii'));
};

function stripquotes(s) {
  var start = 0;
  var end = s.length;
  while ((start < end) && (s[start] === '"')) {
    start++;
  }
  while ((end > start) && (s[end - 1] === '"')) {
    end--;
  }
  if (start >= end) {
    return "";
  }
  return s.substring(start, end);
}

function splitNameValue(nvpair) {
  var eq = -1;
  var inQuotes = false;

  for (var i = 0; i < nvpair.length; i++) {
    if (nvpair[i] === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (inQuotes) {
      continue;
    }
    if (nvpair[i] === '=') {
      eq = i;
      break;
    }
  }

  if (eq === -1) {
    return {'name': nvpair, 'value': null};
  }

  var name = stripquotes(nvpair.substring(0, eq).trim());
  var value = stripquotes(nvpair.substring(eq + 1).trim());
  return {'name': name, 'value': value};
}

function splitHeaderParameters(hv) {
  return parseHeaderValue(hv, ';', splitNameValue);
}

function parseHeaderValue(hv, separator, callback) {
  var start = 0;
  var inQuotes = false;
  var values = [];

  for (var i = 0; i < hv.length; i++) {
    if (hv[i] === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (inQuotes) {
      // Just skip this
      continue;
    }
    if (hv[i] === separator) {
      var newValue = hv.substring(start, i).trim();
      if (newValue.length > 0) {
        newValue = callback(newValue);
        values.push(newValue);
      }
      start = i + 1;
    }
  }

  var newValue = hv.substring(start).trim();
  if (newValue.length > 0) {
    newValue = callback(newValue);
    values.push(newValue);
  }

  return values;
}

function rsplit(s, delim, count) {
  var nsplits = 0;
  var end = s.length;
  var rval = [];
  for (var i = s.length - 1; i >= 0; i--) {
    if (s[i] === delim) {
      var t = s.substring(i + 1, end);
      end = i;
      rval.unshift(t);
      nsplits++;
      if (nsplits === count) {
        break;
      }
    }
  }
  if (end !== 0) {
    rval.unshift(s.substring(0, end));
  }
  return rval;
}

function ishex(c) {
  return ('0123456789ABCDEFabcdef'.indexOf(c) > -1);
}

function unescape(s) {
  var i = 0;
  var t = '';
  while (i < s.length) {
    if (s[i] != '%' || !ishex(s[i + 1]) || !ishex(s[i + 2])) {
      t += s[i];
    } else {
      ++i;
      var hexvalue = '';
      if (i < s.length) {
        hexvalue += s[i];
        ++i;
      }
      if (i < s.length) {
        hexvalue += s[i];
      }
      if (hexvalue.length > 0) {
        t += new Buffer(hexvalue, 'hex').toString();
      } else {
        t += '%';
      }
    }

    ++i;
  }
  return t;
}

Deserializer.ALTSVC = function readAltSvc(buffer, frame) {
  if (buffer.length < 2) {
    return 'FRAME_SIZE_ERROR';
  }
  var originLength = buffer.readUInt16BE(0);
  if ((buffer.length - 2) < originLength) {
    return 'FRAME_SIZE_ERROR';
  }
  frame.origin = buffer.toString('ascii', 2, 2 + originLength);
  var fieldValue = buffer.toString('ascii', 2 + originLength);
  var values = parseHeaderValue(fieldValue, ',', splitHeaderParameters);
  if (values.length > 1) {
    // TODO - warn that we only use one here
  }
  if (values.length === 0) {
    // Well that's a malformed frame. Just ignore it.
    return;
  }

  var chosenAltSvc = values[0];
  frame.maxAge = 86400; // Default
  for (var i = 0; i < chosenAltSvc.length; i++) {
    if (i === 0) {
      // This corresponds to the protocolID="<host>:<port>" item
      frame.protocolID = unescape(chosenAltSvc[i].name);
      var hostport = rsplit(chosenAltSvc[i].value, ':', 1);
      frame.host = hostport[0];
      frame.port = parseInt(hostport[1], 10);
    } else if (chosenAltSvc[i].name == 'ma') {
      frame.maxAge = parseInt(chosenAltSvc[i].value, 10);
    }
    // Otherwise, we just ignore this
  }
};

// BLOCKED
// ------------------------------------------------------------
//
// The BLOCKED frame (type=0xB) indicates that the sender is unable to send data
// due to a closed flow control window.
//
// The BLOCKED frame does not define any flags and contains no payload.

frameTypes[0xB] = 'BLOCKED';

frameFlags.BLOCKED = [];

typeSpecificAttributes.BLOCKED = [];

Serializer.BLOCKED = function writeBlocked(frame, buffers) {
};

Deserializer.BLOCKED = function readBlocked(buffer, frame) {
};

// [Error Codes](http://tools.ietf.org/html/draft-ietf-httpbis-http2-16#section-7)
// ------------------------------------------------------------

var errorCodes = [
  'NO_ERROR',
  'PROTOCOL_ERROR',
  'INTERNAL_ERROR',
  'FLOW_CONTROL_ERROR',
  'SETTINGS_TIMEOUT',
  'STREAM_CLOSED',
  'FRAME_SIZE_ERROR',
  'REFUSED_STREAM',
  'CANCEL',
  'COMPRESSION_ERROR',
  'CONNECT_ERROR',
  'ENHANCE_YOUR_CALM',
  'INADEQUATE_SECURITY',
  'HTTP_1_1_REQUIRED'
];

// Logging
// -------

// [Bunyan serializers](https://github.com/trentm/node-bunyan#serializers) to improve logging output
// for debug messages emitted in this component.
exports.serializers = {};

// * `frame` serializer: it transforms data attributes from Buffers to hex strings and filters out
//   flags that are not present.
var frameCounter = 0;
exports.serializers.frame = function(frame) {
  if (!frame) {
    return null;
  }

  if ('id' in frame) {
    return frame.id;
  }

  frame.id = frameCounter;
  frameCounter += 1;

  var logEntry = { id: frame.id };
  genericAttributes.concat(typeSpecificAttributes[frame.type]).forEach(function(name) {
    logEntry[name] = frame[name];
  });

  if (frame.data instanceof Buffer) {
    if (logEntry.data.length > 50) {
      logEntry.data = frame.data.slice(0, 47).toString('hex') + '...';
    } else {
      logEntry.data = frame.data.toString('hex');
    }

    if (!('length' in logEntry)) {
      logEntry.length = frame.data.length;
    }
  }

  if (frame.promised_stream instanceof Object) {
    logEntry.promised_stream = 'stream-' + frame.promised_stream.id;
  }

  logEntry.flags = Object.keys(frame.flags || {}).filter(function(name) {
    return frame.flags[name] === true;
  });

  return logEntry;
};

// * `data` serializer: it simply transforms a buffer to a hex string.
exports.serializers.data = function(data) {
  return data.toString('hex');
};
