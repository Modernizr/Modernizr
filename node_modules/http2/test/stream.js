var expect = require('chai').expect;
var util = require('./util');

var stream = require('../lib/protocol/stream');
var Stream = stream.Stream;

function createStream() {
  var stream = new Stream(util.log, null);
  stream.upstream._window = Infinity;
  return stream;
}

// Execute a list of commands and assertions
var recorded_events = ['state', 'error', 'window_update', 'headers', 'promise'];
function execute_sequence(stream, sequence, done) {
  if (!done) {
    done = sequence;
    sequence = stream;
    stream = createStream();
  }

  var outgoing_frames = [];

  var emit = stream.emit, events = [];
  stream.emit = function(name) {
    if (recorded_events.indexOf(name) !== -1) {
      events.push({ name: name, data: Array.prototype.slice.call(arguments, 1) });
    }
    return emit.apply(this, arguments);
  };

  var commands = [], checks = [];
  sequence.forEach(function(step) {
    if ('method' in step || 'incoming' in step || 'outgoing' in step || 'wait' in step || 'set_state' in step) {
      commands.push(step);
    }

    if ('outgoing' in step || 'event' in step || 'active' in step) {
      checks.push(step);
    }
  });

  var activeCount = 0;
  function count_change(change) {
    activeCount += change;
  }

  function execute(callback) {
    var command = commands.shift();
    if (command) {
      if ('method' in command) {
        var value = stream[command.method.name].apply(stream, command.method.arguments);
        if (command.method.ret) {
          command.method.ret(value);
        }
        execute(callback);
      } else if ('incoming' in command) {
        command.incoming.count_change = count_change;
        stream.upstream.write(command.incoming);
        execute(callback);
      } else if ('outgoing' in command) {
        outgoing_frames.push(stream.upstream.read());
        execute(callback);
      } else if ('set_state' in command) {
        stream.state = command.set_state;
        execute(callback);
      } else if ('wait' in command) {
        setTimeout(execute.bind(null, callback), command.wait);
      } else {
        throw new Error('Invalid command', command);
      }
    } else {
      setTimeout(callback, 5);
    }
  }

  function check() {
    checks.forEach(function(check) {
      if ('outgoing' in check) {
        var frame = outgoing_frames.shift();
        for (var key in check.outgoing) {
          expect(frame).to.have.property(key).that.deep.equals(check.outgoing[key]);
        }
        count_change(frame.count_change);
      } else if ('event' in check) {
        var event = events.shift();
        expect(event.name).to.be.equal(check.event.name);
        check.event.data.forEach(function(data, index) {
          expect(event.data[index]).to.deep.equal(data);
        });
      } else if ('active' in check) {
        expect(activeCount).to.be.equal(check.active);
      } else {
        throw new Error('Invalid check', check);
      }
    });
    done();
  }

  setImmediate(execute.bind(null, check));
}

var example_frames = [
  { type: 'PRIORITY', flags: {}, priority: 1 },
  { type: 'WINDOW_UPDATE', flags: {}, settings: {} },
  { type: 'RST_STREAM', flags: {}, error: 'CANCEL' },
  { type: 'HEADERS', flags: {}, headers: {}, priority: undefined },
  { type: 'DATA', flags: {}, data: new Buffer(5) },
  { type: 'PUSH_PROMISE', flags: {}, headers: {}, promised_stream: new Stream(util.log, null) }
];

var invalid_incoming_frames = {
  IDLE: [
    { type: 'DATA', flags: {}, data: new Buffer(5) },
    { type: 'WINDOW_UPDATE', flags: {}, settings: {} },
    { type: 'PUSH_PROMISE', flags: {}, headers: {} },
    { type: 'RST_STREAM', flags: {}, error: 'CANCEL' }
  ],
  RESERVED_LOCAL: [
    { type: 'DATA', flags: {}, data: new Buffer(5) },
    { type: 'HEADERS', flags: {}, headers: {}, priority: undefined },
    { type: 'PUSH_PROMISE', flags: {}, headers: {} },
    { type: 'WINDOW_UPDATE', flags: {}, settings: {} }
  ],
  RESERVED_REMOTE: [
    { type: 'DATA', flags: {}, data: new Buffer(5) },
    { type: 'PUSH_PROMISE', flags: {}, headers: {} },
    { type: 'WINDOW_UPDATE', flags: {}, settings: {} }
  ],
  OPEN: [
  ],
  HALF_CLOSED_LOCAL: [
  ],
  HALF_CLOSED_REMOTE: [
    { type: 'DATA', flags: {}, data: new Buffer(5) },
    { type: 'HEADERS', flags: {}, headers: {}, priority: undefined },
    { type: 'PUSH_PROMISE', flags: {}, headers: {} }
  ]
};

var invalid_outgoing_frames = {
  IDLE: [
    { type: 'DATA', flags: {}, data: new Buffer(5) },
    { type: 'WINDOW_UPDATE', flags: {}, settings: {} },
    { type: 'PUSH_PROMISE', flags: {}, headers: {} }
  ],
  RESERVED_LOCAL: [
    { type: 'DATA', flags: {}, data: new Buffer(5) },
    { type: 'PUSH_PROMISE', flags: {}, headers: {} },
    { type: 'WINDOW_UPDATE', flags: {}, settings: {} }
  ],
  RESERVED_REMOTE: [
    { type: 'DATA', flags: {}, data: new Buffer(5) },
    { type: 'HEADERS', flags: {}, headers: {}, priority: undefined },
    { type: 'PUSH_PROMISE', flags: {}, headers: {} },
    { type: 'WINDOW_UPDATE', flags: {}, settings: {} }
  ],
  OPEN: [
  ],
  HALF_CLOSED_LOCAL: [
    { type: 'DATA', flags: {}, data: new Buffer(5) },
    { type: 'HEADERS', flags: {}, headers: {}, priority: undefined },
    { type: 'PUSH_PROMISE', flags: {}, headers: {} }
  ],
  HALF_CLOSED_REMOTE: [
  ],
  CLOSED: [
    { type: 'WINDOW_UPDATE', flags: {}, settings: {} },
    { type: 'HEADERS', flags: {}, headers: {}, priority: undefined },
    { type: 'DATA', flags: {}, data: new Buffer(5) },
    { type: 'PUSH_PROMISE', flags: {}, headers: {}, promised_stream: new Stream(util.log, null) }
  ]
};

describe('stream.js', function() {
  describe('Stream class', function() {
    describe('._transition(sending, frame) method', function() {
      it('should emit error, and answer RST_STREAM for invalid incoming frames', function() {
        Object.keys(invalid_incoming_frames).forEach(function(state) {
          invalid_incoming_frames[state].forEach(function(invalid_frame) {
            var stream = createStream();
            var connectionErrorHappened = false;
            stream.state = state;
            stream.once('connectionError', function() { connectionErrorHappened = true; });
            stream._transition(false, invalid_frame);
            expect(connectionErrorHappened);
          });
        });

        // CLOSED state as a result of incoming END_STREAM (or RST_STREAM)
        var stream = createStream();
        stream.headers({});
        stream.end();
        stream.upstream.write({ type: 'HEADERS', headers:{}, flags: { END_STREAM: true }, count_change: util.noop });
        example_frames.slice(1).forEach(function(invalid_frame) {
          invalid_frame.count_change = util.noop;
          expect(stream._transition.bind(stream, false, invalid_frame)).to.throw('Uncaught, unspecified "error" event.');
        });

        // CLOSED state as a result of outgoing END_STREAM
        stream = createStream();
        stream.upstream.write({ type: 'HEADERS', headers:{}, flags: { END_STREAM: true }, count_change: util.noop });
        stream.headers({});
        stream.end();
        example_frames.slice(3).forEach(function(invalid_frame) {
          invalid_frame.count_change = util.noop;
          expect(stream._transition.bind(stream, false, invalid_frame)).to.throw('Uncaught, unspecified "error" event.');
        });
      });
      it('should throw exception for invalid outgoing frames', function() {
        Object.keys(invalid_outgoing_frames).forEach(function(state) {
          invalid_outgoing_frames[state].forEach(function(invalid_frame) {
            var stream = createStream();
            stream.state = state;
            expect(stream._transition.bind(stream, true, invalid_frame)).to.throw(Error);
          });
        });
      });
      it('should close the stream when there\'s an incoming or outgoing RST_STREAM', function() {
        [
          'RESERVED_LOCAL',
          'RESERVED_REMOTE',
          'OPEN',
          'HALF_CLOSED_LOCAL',
          'HALF_CLOSED_REMOTE'
        ].forEach(function(state) {
            [true, false].forEach(function(sending) {
              var stream = createStream();
              stream.state = state;
              stream._transition(sending, { type: 'RST_STREAM', flags: {} });
              expect(stream.state).to.be.equal('CLOSED');
            });
          });
      });
      it('should ignore any incoming frame after sending reset', function() {
        var stream = createStream();
        stream.reset();
        example_frames.forEach(stream._transition.bind(stream, false));
      });
      it('should ignore certain incoming frames after closing the stream with END_STREAM', function() {
        var stream = createStream();
        stream.upstream.write({ type: 'HEADERS', flags: { END_STREAM: true }, headers:{} });
        stream.headers({});
        stream.end();
        example_frames.slice(0,3).forEach(function(frame) {
          frame.count_change = util.noop;
          stream._transition(false, frame);
        });
      });
    });
  });
  describe('test scenario', function() {
    describe('sending request', function() {
      it('should trigger the appropriate state transitions and outgoing frames', function(done) {
        execute_sequence([
          { method  : { name: 'headers', arguments: [{ ':path': '/' }] } },
          { outgoing: { type: 'HEADERS', flags: { }, headers: { ':path': '/' } } },
          { event   : { name: 'state', data: ['OPEN'] } },

          { wait    : 5 },
          { method  : { name: 'end', arguments: [] } },
          { event   : { name: 'state', data: ['HALF_CLOSED_LOCAL'] } },
          { outgoing: { type: 'DATA', flags: { END_STREAM: true  }, data: new Buffer(0) } },

          { wait    : 10 },
          { incoming: { type: 'HEADERS', flags: { }, headers: { ':status': 200 } } },
          { incoming: { type: 'DATA'   , flags: { END_STREAM: true  }, data: new Buffer(5) } },
          { event   : { name: 'headers', data: [{ ':status': 200 }] } },
          { event   : { name: 'state', data: ['CLOSED'] } },

          { active  : 0 }
        ], done);
      });
    });
    describe('answering request', function() {
      it('should trigger the appropriate state transitions and outgoing frames', function(done) {
        var payload = new Buffer(5);
        execute_sequence([
          { incoming: { type: 'HEADERS', flags: { }, headers: { ':path': '/' } } },
          { event   : { name: 'state', data: ['OPEN'] } },
          { event   : { name: 'headers', data: [{ ':path': '/' }] } },

          { wait    : 5 },
          { incoming: { type: 'DATA', flags: { }, data: new Buffer(5) } },
          { incoming: { type: 'DATA', flags: { END_STREAM: true  }, data: new Buffer(10) } },
          { event   : { name: 'state', data: ['HALF_CLOSED_REMOTE'] } },

          { wait    : 5 },
          { method  : { name: 'headers', arguments: [{ ':status': 200 }] } },
          { outgoing: { type: 'HEADERS', flags: { }, headers: { ':status': 200 } } },

          { wait    : 5 },
          { method  : { name: 'end', arguments: [payload] } },
          { outgoing: { type: 'DATA', flags: { END_STREAM: true  }, data: payload } },
          { event   : { name: 'state', data: ['CLOSED'] } },

          { active  : 0 }
        ], done);
      });
    });
    describe('sending push stream', function() {
      it('should trigger the appropriate state transitions and outgoing frames', function(done) {
        var payload = new Buffer(5);
        var pushStream;

        execute_sequence([
          // receiving request
          { incoming: { type: 'HEADERS', flags: { END_STREAM: true }, headers: { ':path': '/' } } },
          { event   : { name: 'state', data: ['OPEN'] } },
          { event   : { name: 'state', data: ['HALF_CLOSED_REMOTE'] } },
          { event   : { name: 'headers', data: [{ ':path': '/' }] } },

          // sending response headers
          { wait    : 5 },
          { method  : { name: 'headers', arguments: [{ ':status': '200' }] } },
          { outgoing: { type: 'HEADERS', flags: {  }, headers: { ':status': '200' } } },

          // sending push promise
          { method  : { name: 'promise', arguments: [{ ':path': '/' }], ret: function(str) { pushStream = str; } } },
          { outgoing: { type: 'PUSH_PROMISE', flags: { }, headers: { ':path': '/' } } },

          // sending response data
          { method  : { name: 'end', arguments: [payload] } },
          { outgoing: { type: 'DATA', flags: { END_STREAM: true  }, data: payload } },
          { event   : { name: 'state', data: ['CLOSED'] } },

          { active  : 0 }
        ], function() {
          // initial state of the promised stream
          expect(pushStream.state).to.equal('RESERVED_LOCAL');

          execute_sequence(pushStream, [
            // push headers
            { wait    : 5 },
            { method  : { name: 'headers', arguments: [{ ':status': '200' }] } },
            { outgoing: { type: 'HEADERS', flags: { }, headers: { ':status': '200' } } },
            { event   : { name: 'state', data: ['HALF_CLOSED_REMOTE'] } },

            // push data
            { method  : { name: 'end', arguments: [payload] } },
            { outgoing: { type: 'DATA', flags: { END_STREAM: true  }, data: payload } },
            { event   : { name: 'state', data: ['CLOSED'] } },

            { active  : 1 }
          ], done);
        });
      });
    });
    describe('receiving push stream', function() {
      it('should trigger the appropriate state transitions and outgoing frames', function(done) {
        var payload = new Buffer(5);
        var original_stream = createStream();
        var promised_stream = createStream();

        done = util.callNTimes(2, done);

        execute_sequence(original_stream, [
          // sending request headers
          { method  : { name: 'headers', arguments: [{ ':path': '/' }] } },
          { method  : { name: 'end', arguments: [] } },
          { outgoing: { type: 'HEADERS', flags: { END_STREAM: true  }, headers: { ':path': '/' } } },
          { event   : { name: 'state', data: ['OPEN'] } },
          { event   : { name: 'state', data: ['HALF_CLOSED_LOCAL'] } },

          // receiving response headers
          { wait    : 10 },
          { incoming: { type: 'HEADERS', flags: { }, headers: { ':status': 200 } } },
          { event   : { name: 'headers', data: [{ ':status': 200 }] } },

          // receiving push promise
          { incoming: { type: 'PUSH_PROMISE', flags: { }, headers: { ':path': '/2.html' }, promised_stream: promised_stream } },
          { event   : { name: 'promise', data: [promised_stream, { ':path': '/2.html' }] } },

          // receiving response data
          { incoming: { type: 'DATA'   , flags: { END_STREAM: true  }, data: payload } },
          { event   : { name: 'state', data: ['CLOSED'] } },

          { active  : 0 }
        ], done);

        execute_sequence(promised_stream, [
          // initial state of the promised stream
          { event   : { name: 'state', data: ['RESERVED_REMOTE'] } },

          // push headers
          { wait    : 10 },
          { incoming: { type: 'HEADERS', flags: { END_STREAM: false }, headers: { ':status': 200 } } },
          { event   : { name: 'state', data: ['HALF_CLOSED_LOCAL'] } },
          { event   : { name: 'headers', data: [{ ':status': 200 }] } },

          // push data
          { incoming: { type: 'DATA', flags: { END_STREAM: true  }, data: payload } },
          { event   : { name: 'state', data: ['CLOSED'] } },

          { active  : 0 }
        ], done);
      });
    });
  });

  describe('bunyan formatter', function() {
    describe('`s`', function() {
      var format = stream.serializers.s;
      it('should assign a unique ID to each frame', function() {
        var stream1 = createStream();
        var stream2 = createStream();
        expect(format(stream1)).to.be.equal(format(stream1));
        expect(format(stream2)).to.be.equal(format(stream2));
        expect(format(stream1)).to.not.be.equal(format(stream2));
      });
    });
  });
});
