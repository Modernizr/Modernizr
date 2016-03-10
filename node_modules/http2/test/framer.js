var expect = require('chai').expect;
var util = require('./util');

var framer = require('../lib/protocol/framer');
var Serializer = framer.Serializer;
var Deserializer = framer.Deserializer;

var frame_types = {
  DATA:          ['data'],
  HEADERS:       ['priority_information', 'data'],
  PRIORITY:      ['priority_information'],
  RST_STREAM:    ['error'],
  SETTINGS:      ['settings'],
  PUSH_PROMISE:  ['promised_stream', 'data'],
  PING:          ['data'],
  GOAWAY:        ['last_stream', 'error'],
  WINDOW_UPDATE: ['window_size'],
  CONTINUATION:  ['data'],
  ALTSVC:        ['protocolID', 'host', 'port', 'origin', 'maxAge']
};

var test_frames = [{
  frame: {
    type: 'DATA',
    flags: { END_STREAM: false, RESERVED2: false, RESERVED4: false,
             PADDED: false },
    stream: 10,

    data: new Buffer('12345678', 'hex')
  },
  // length + type + flags + stream +   content
  buffer: new Buffer('000004' + '00' + '00' + '0000000A' +   '12345678', 'hex')

}, {
  frame: {
    type: 'HEADERS',
    flags: { END_STREAM: false, RESERVED2: false, END_HEADERS: false,
             PADDED: false, RESERVED5: false, PRIORITY: false },
    stream: 15,

    data: new Buffer('12345678', 'hex')
  },
  buffer: new Buffer('000004' + '01' + '00' + '0000000F' +   '12345678', 'hex')

}, {
  frame: {
    type: 'HEADERS',
    flags: { END_STREAM: false, RESERVED2: false, END_HEADERS: false,
             PADDED: false, RESERVED5: false, PRIORITY: true },
    stream: 15,
    priorityDependency: 10,
    priorityWeight: 5,
    exclusiveDependency: false,

    data: new Buffer('12345678', 'hex')
  },
  buffer: new Buffer('000009' + '01' + '20' + '0000000F' + '0000000A' + '05' + '12345678', 'hex')


}, {
  frame: {
    type: 'HEADERS',
    flags: { END_STREAM: false, RESERVED2: false, END_HEADERS: false,
             PADDED: false, RESERVED5: false, PRIORITY: true },
    stream: 15,
    priorityDependency: 10,
    priorityWeight: 5,
    exclusiveDependency: true,

    data: new Buffer('12345678', 'hex')
  },
  buffer: new Buffer('000009' + '01' + '20' + '0000000F' + '8000000A' + '05' + '12345678', 'hex')

}, {
  frame: {
    type: 'PRIORITY',
    flags: { },
    stream: 10,

    priorityDependency: 9,
    priorityWeight: 5,
    exclusiveDependency: false
  },
  buffer: new Buffer('000005' + '02' + '00' + '0000000A' + '00000009' + '05', 'hex')

}, {
  frame: {
    type: 'PRIORITY',
    flags: { },
    stream: 10,

    priorityDependency: 9,
    priorityWeight: 5,
    exclusiveDependency: true
  },
  buffer: new Buffer('000005' + '02' + '00' + '0000000A' + '80000009' + '05', 'hex')

}, {
  frame: {
    type: 'RST_STREAM',
    flags: { },
    stream: 10,

    error: 'INTERNAL_ERROR'
  },
  buffer: new Buffer('000004' + '03' + '00' + '0000000A' +   '00000002', 'hex')

}, {
  frame: {
    type: 'SETTINGS',
    flags: { ACK: false },
    stream: 10,

    settings: {
      SETTINGS_HEADER_TABLE_SIZE: 0x12345678,
      SETTINGS_ENABLE_PUSH: true,
      SETTINGS_MAX_CONCURRENT_STREAMS: 0x01234567,
      SETTINGS_INITIAL_WINDOW_SIZE:    0x89ABCDEF,
      SETTINGS_MAX_FRAME_SIZE:         0x00010000
    }
  },
  buffer: new Buffer('00001E' + '04' + '00' + '0000000A' +   '0001' + '12345678' +
                                                             '0002' + '00000001' +
                                                             '0003' + '01234567' +
                                                             '0004' + '89ABCDEF' +
                                                             '0005' + '00010000', 'hex')

}, {
  frame: {
    type: 'PUSH_PROMISE',
    flags: { RESERVED1: false, RESERVED2: false, END_PUSH_PROMISE: false,
             PADDED: false },
    stream: 15,

    promised_stream: 3,
    data: new Buffer('12345678', 'hex')
  },
  buffer: new Buffer('000008' + '05' + '00' + '0000000F' +   '00000003' + '12345678', 'hex')

}, {
  frame: {
    type: 'PING',
    flags: { ACK: false },
    stream: 15,

    data: new Buffer('1234567887654321', 'hex')
  },
  buffer: new Buffer('000008' + '06' + '00' + '0000000F' +   '1234567887654321', 'hex')

}, {
  frame: {
    type: 'GOAWAY',
    flags: { },
    stream: 10,

    last_stream: 0x12345678,
    error: 'PROTOCOL_ERROR'
  },
  buffer: new Buffer('000008' + '07' + '00' + '0000000A' +   '12345678' + '00000001', 'hex')

}, {
  frame: {
    type: 'WINDOW_UPDATE',
    flags: { },
    stream: 10,

    window_size: 0x12345678
  },
  buffer: new Buffer('000004' + '08' + '00' + '0000000A' +   '12345678', 'hex')
}, {
  frame: {
    type: 'CONTINUATION',
    flags: { RESERVED1: false, RESERVED2: false, END_HEADERS: true },
    stream: 10,

    data: new Buffer('12345678', 'hex')
  },
  // length + type + flags + stream +   content
  buffer: new Buffer('000004' + '09' + '04' + '0000000A' +   '12345678', 'hex')
}, {
  frame: {
    type: 'ALTSVC',
    flags: { },
    stream: 0,

    maxAge: 31536000,
    port: 4443,
    protocolID: "h2",
    host: "altsvc.example.com",
    origin: ""
  },
  buffer: new Buffer(new Buffer('00002B' + '0A' + '00' + '00000000' + '0000', 'hex') + new Buffer('h2="altsvc.example.com:4443"; ma=31536000', 'ascii'))
}, {
  frame: {
    type: 'ALTSVC',
    flags: { },
    stream: 0,

    maxAge: 31536000,
    port: 4443,
    protocolID: "h2",
    host: "altsvc.example.com",
    origin: "https://onlyme.example.com"
  },
  buffer: new Buffer(new Buffer('000045' + '0A' + '00' + '00000000' + '001A', 'hex') + new Buffer('https://onlyme.example.comh2="altsvc.example.com:4443"; ma=31536000', 'ascii'))

}, {
  frame: {
    type: 'BLOCKED',
    flags: { },
    stream: 10
  },
  buffer: new Buffer('000000' + '0B' + '00' + '0000000A', 'hex')
}];

var deserializer_test_frames = test_frames.slice(0);
var padded_test_frames = [{
  frame: {
    type: 'DATA',
    flags: { END_STREAM: false, RESERVED2: false, RESERVED4: false,
             PADDED: true },
    stream: 10,
    data: new Buffer('12345678', 'hex')
  },
  // length + type + flags + stream + pad length + content + padding
  buffer: new Buffer('00000B' + '00' + '08' + '0000000A' + '06' + '12345678' + '000000000000', 'hex')

}, {
  frame: {
    type: 'HEADERS',
    flags: { END_STREAM: false, RESERVED2: false, END_HEADERS: false,
             PADDED: true, RESERVED5: false, PRIORITY: false },
    stream: 15,

    data: new Buffer('12345678', 'hex')
  },
  // length + type + flags + stream + pad length + data + padding
  buffer: new Buffer('00000B' + '01' + '08' + '0000000F' + '06' + '12345678' + '000000000000', 'hex')

}, {
  frame: {
    type: 'HEADERS',
    flags: { END_STREAM: false, RESERVED2: false, END_HEADERS: false,
             PADDED: true, RESERVED5: false, PRIORITY: true },
    stream: 15,
    priorityDependency: 10,
    priorityWeight: 5,
    exclusiveDependency: false,

    data: new Buffer('12345678', 'hex')
  },
  // length + type + flags + stream + pad length + priority dependency + priority weight + data + padding
  buffer: new Buffer('000010' + '01' + '28' + '0000000F' + '06' + '0000000A' + '05' + '12345678' + '000000000000', 'hex')

}, {
  frame: {
    type: 'HEADERS',
    flags: { END_STREAM: false, RESERVED2: false, END_HEADERS: false,
             PADDED: true, RESERVED5: false, PRIORITY: true },
    stream: 15,
    priorityDependency: 10,
    priorityWeight: 5,
    exclusiveDependency: true,

    data: new Buffer('12345678', 'hex')
  },
  // length + type + flags + stream + pad length + priority dependency + priority weight + data + padding
  buffer: new Buffer('000010' + '01' + '28' + '0000000F' + '06' + '8000000A' + '05' + '12345678' + '000000000000', 'hex')

}, {
  frame: {
    type: 'PUSH_PROMISE',
    flags: { RESERVED1: false, RESERVED2: false, END_PUSH_PROMISE: false,
             PADDED: true },
    stream: 15,

    promised_stream: 3,
    data: new Buffer('12345678', 'hex')
  },
  // length + type + flags + stream + pad length + promised stream + data + padding
  buffer: new Buffer('00000F' + '05' + '08' + '0000000F' + '06' + '00000003' + '12345678' + '000000000000', 'hex')

}];
for (var idx = 0; idx < padded_test_frames.length; idx++) {
  deserializer_test_frames.push(padded_test_frames[idx]);
}


describe('framer.js', function() {
  describe('Serializer', function() {
    describe('static method .commonHeader({ type, flags, stream }, buffer_array)', function() {
      it('should add the appropriate 9 byte header buffer in front of the others', function() {
        for (var i = 0; i < test_frames.length; i++) {
          var test = test_frames[i];
          var buffers = [test.buffer.slice(9)];
          var header_buffer = test.buffer.slice(0,9);
          Serializer.commonHeader(test.frame, buffers);
          expect(buffers[0]).to.deep.equal(header_buffer);
        }
      });
    });

    Object.keys(frame_types).forEach(function(type) {
      var tests = test_frames.filter(function(test) { return test.frame.type === type; });
      var frame_shape = '{ ' + frame_types[type].join(', ') + ' }';
      describe('static method .' + type + '(' + frame_shape + ', buffer_array)', function() {
        it('should push buffers to the array that make up a ' + type + ' type payload', function() {
          for (var i = 0; i < tests.length; i++) {
            var test = tests[i];
            var buffers = [];
            Serializer[type](test.frame, buffers);
            expect(util.concat(buffers)).to.deep.equal(test.buffer.slice(9));
          }
        });
      });
    });

    describe('transform stream', function() {
      it('should transform frame objects to appropriate buffers', function() {
        var stream = new Serializer(util.log);

        for (var i = 0; i < test_frames.length; i++) {
          var test = test_frames[i];
          stream.write(test.frame);
          var chunk, buffer = new Buffer(0);
          while (chunk = stream.read()) {
            buffer = util.concat([buffer, chunk]);
          }
          expect(buffer).to.be.deep.equal(test.buffer);
        }
      });
    });
  });

  describe('Deserializer', function() {
    describe('static method .commonHeader(header_buffer, frame)', function() {
      it('should augment the frame object with these properties: { type, flags, stream })', function() {
        for (var i = 0; i < deserializer_test_frames.length; i++) {
          var test = deserializer_test_frames[i], frame = {};
          Deserializer.commonHeader(test.buffer.slice(0,9), frame);
          expect(frame).to.deep.equal({
            type:   test.frame.type,
            flags:  test.frame.flags,
            stream: test.frame.stream
          });
        }
      });
    });

    Object.keys(frame_types).forEach(function(type) {
      var tests = deserializer_test_frames.filter(function(test) { return test.frame.type === type; });
      var frame_shape = '{ ' + frame_types[type].join(', ') + ' }';
      describe('static method .' + type + '(payload_buffer, frame)', function() {
        it('should augment the frame object with these properties: ' + frame_shape, function() {
          for (var i = 0; i < tests.length; i++) {
            var test = tests[i];
            var frame = {
              type:   test.frame.type,
              flags:  test.frame.flags,
              stream: test.frame.stream
            };
            Deserializer[type](test.buffer.slice(9), frame);
            expect(frame).to.deep.equal(test.frame);
          }
        });
      });
    });

    describe('transform stream', function() {
      it('should transform buffers to appropriate frame object', function() {
        var stream = new Deserializer(util.log);

        var shuffled = util.shuffleBuffers(deserializer_test_frames.map(function(test) { return test.buffer; }));
        shuffled.forEach(stream.write.bind(stream));

        for (var j = 0; j < deserializer_test_frames.length; j++) {
          expect(stream.read()).to.be.deep.equal(deserializer_test_frames[j].frame);
        }
      });
    });
  });

  describe('bunyan formatter', function() {
    describe('`frame`', function() {
      var format = framer.serializers.frame;
      it('should assign a unique ID to each frame', function() {
        var frame1 = { type: 'DATA', data: new Buffer(10) };
        var frame2 = { type: 'PRIORITY', priority: 1 };
        expect(format(frame1).id).to.be.equal(format(frame1));
        expect(format(frame2).id).to.be.equal(format(frame2));
        expect(format(frame1)).to.not.be.equal(format(frame2));
      });
    });
  });
});
