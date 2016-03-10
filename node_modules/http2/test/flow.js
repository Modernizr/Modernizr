var expect = require('chai').expect;
var util = require('./util');

var Flow = require('../lib/protocol/flow').Flow;

var MAX_PAYLOAD_SIZE = 4096;

function createFlow(log) {
  var flowControlId = util.random(10, 100);
  var flow = new Flow(flowControlId);
  flow._log = util.log.child(log || {});
  return flow;
}

describe('flow.js', function() {
  describe('Flow class', function() {
    var flow;
    beforeEach(function() {
      flow = createFlow();
    });

    describe('._receive(frame, callback) method', function() {
      it('is called when there\'s a frame in the input buffer to be consumed', function(done) {
        var frame = { type: 'PRIORITY', flags: {}, priority: 1 };
        flow._receive = function _receive(receivedFrame, callback) {
          expect(receivedFrame).to.equal(frame);
          callback();
        };
        flow.write(frame, done);
      });
      it('has to be overridden by the child class, otherwise it throws', function() {
        expect(flow._receive.bind(flow)).to.throw(Error);
      });
    });
    describe('._send() method', function() {
      it('is called when the output buffer should be filled with more frames and the flow' +
         'control queue is empty', function() {
        var notFlowControlledFrame = { type: 'PRIORITY', flags: {}, priority: 1 };
        flow._send = function _send() {
          this.push(notFlowControlledFrame);
        };
        expect(flow.read()).to.equal(notFlowControlledFrame);

        flow._window = 0;
        flow._queue.push({ type: 'DATA', flags: {}, data: { length: 1 } });
        var frame = flow.read();
        while (frame.type === notFlowControlledFrame.type) frame = flow.read();
        expect(frame.type).to.equal('BLOCKED');
        expect(flow.read()).to.equal(null);
      });
      it('has to be overridden by the child class, otherwise it throws', function() {
        expect(flow._send.bind(flow)).to.throw(Error);
      });
    });
    describe('._increaseWindow(size) method', function() {
      it('should increase `this._window` by `size`', function() {
        flow._send = util.noop;
        flow._window = 0;

        var increase1 = util.random(0,100);
        var increase2 = util.random(0,100);
        flow._increaseWindow(increase1);
        flow._increaseWindow(increase2);
        expect(flow._window).to.equal(increase1 + increase2);

        flow._increaseWindow(Infinity);
        expect(flow._window).to.equal(Infinity);
      });
      it('should emit error when increasing with a finite `size` when `_window` is infinite', function() {
        flow._send = util.noop;
        flow._increaseWindow(Infinity);
        var increase = util.random(1,100);

        expect(flow._increaseWindow.bind(flow, increase)).to.throw('Uncaught, unspecified "error" event.');
      });
      it('should emit error when `_window` grows over the window limit', function() {
        var WINDOW_SIZE_LIMIT = Math.pow(2, 31) - 1;
        flow._send = util.noop;
        flow._window = 0;

        flow._increaseWindow(WINDOW_SIZE_LIMIT);
        expect(flow._increaseWindow.bind(flow, 1)).to.throw('Uncaught, unspecified "error" event.');

      });
    });
    describe('.read() method', function() {
      describe('when the flow control queue is not empty', function() {
        it('should return the first item in the queue if the window is enough', function() {
          var priorityFrame = { type: 'PRIORITY', flags: {}, priority: 1 };
          var dataFrame = { type: 'DATA', flags: {}, data: { length: 10 } };
          flow._send = util.noop;
          flow._window = 10;
          flow._queue = [priorityFrame, dataFrame];

          expect(flow.read()).to.equal(priorityFrame);
          expect(flow.read()).to.equal(dataFrame);
        });
        it('should also split DATA frames when needed', function() {
          var buffer = new Buffer(10);
          var dataFrame = { type: 'DATA', flags: {}, stream: util.random(0, 100), data: buffer };
          flow._send = util.noop;
          flow._window = 5;
          flow._queue = [dataFrame];

          var expectedFragment = { flags: {}, type: 'DATA', stream: dataFrame.stream, data: buffer.slice(0,5) };
          expect(flow.read()).to.deep.equal(expectedFragment);
          expect(dataFrame.data).to.deep.equal(buffer.slice(5));
        });
      });
    });
    describe('.push(frame) method', function() {
      it('should push `frame` into the output queue or the flow control queue', function() {
        var priorityFrame = { type: 'PRIORITY', flags: {}, priority: 1 };
        var dataFrame = { type: 'DATA', flags: {}, data: { length: 10 } };
        flow._window = 10;

        flow.push(dataFrame);     // output queue
        flow.push(dataFrame);     // flow control queue, because of depleted window
        flow.push(priorityFrame); // flow control queue, because it's not empty

        expect(flow.read()).to.be.equal(dataFrame);
        expect(flow._queue[0]).to.be.equal(dataFrame);
        expect(flow._queue[1]).to.be.equal(priorityFrame);
      });
    });
    describe('.write() method', function() {
      it('call with a DATA frame should trigger sending WINDOW_UPDATE if remote flow control is not' +
         'disabled', function(done) {
        flow._window = 100;
        flow._send = util.noop;
        flow._receive = function(frame, callback) {
          callback();
        };

        var buffer = new Buffer(util.random(10, 100));
        flow.write({ type: 'DATA', flags: {}, data: buffer });
        flow.once('readable', function() {
          expect(flow.read()).to.be.deep.equal({
            type: 'WINDOW_UPDATE',
            flags: {},
            stream: flow._flowControlId,
            window_size: buffer.length
          });
          done();
        });
      });
    });
  });
  describe('test scenario', function() {
    var flow1, flow2;
    beforeEach(function() {
      flow1 = createFlow({ flow: 1 });
      flow2 = createFlow({ flow: 2 });
      flow1._flowControlId = flow2._flowControlId;
      flow1._send = flow2._send = util.noop;
      flow1._receive = flow2._receive = function(frame, callback) { callback(); };
    });

    describe('sending a large data stream', function() {
      it('should work as expected', function(done) {
        // Sender side
        var frameNumber = util.random(5, 8);
        var input = [];
        flow1._send = function _send() {
          if (input.length >= frameNumber) {
            this.push({ type: 'DATA', flags: { END_STREAM: true }, data: new Buffer(0) });
            this.push(null);
          } else {
            var buffer = new Buffer(util.random(1000, 100000));
            input.push(buffer);
            this.push({ type: 'DATA', flags: {}, data: buffer });
          }
        };

        // Receiver side
        var output = [];
        flow2._receive = function _receive(frame, callback) {
          if (frame.type === 'DATA') {
            expect(frame.data.length).to.be.lte(MAX_PAYLOAD_SIZE);
            output.push(frame.data);
          }
          if (frame.flags.END_STREAM) {
            this.emit('end_stream');
          }
          callback();
        };

        // Checking results
        flow2.on('end_stream', function() {
          input = util.concat(input);
          output = util.concat(output);

          expect(input).to.deep.equal(output);

          done();
        });

        // Start piping
        flow1.pipe(flow2).pipe(flow1);
      });
    });

    describe('when running out of window', function() {
      it('should send a BLOCKED frame', function(done) {
        // Sender side
        var frameNumber = util.random(5, 8);
        var input = [];
        flow1._send = function _send() {
          if (input.length >= frameNumber) {
            this.push({ type: 'DATA', flags: { END_STREAM: true }, data: new Buffer(0) });
            this.push(null);
          } else {
            var buffer = new Buffer(util.random(1000, 100000));
            input.push(buffer);
            this.push({ type: 'DATA', flags: {}, data: buffer });
          }
        };

        // Receiver side
        // Do not send WINDOW_UPDATESs except when the other side sends BLOCKED
        var output = [];
        flow2._restoreWindow = util.noop;
        flow2._receive = function _receive(frame, callback) {
          if (frame.type === 'DATA') {
            expect(frame.data.length).to.be.lte(MAX_PAYLOAD_SIZE);
            output.push(frame.data);
          }
          if (frame.flags.END_STREAM) {
            this.emit('end_stream');
          }
          if (frame.type === 'BLOCKED') {
            setTimeout(function() {
              this._push({
                type: 'WINDOW_UPDATE',
                flags: {},
                stream: this._flowControlId,
                window_size: this._received
              });
              this._received = 0;
            }.bind(this), 20);
          }
          callback();
        };

        // Checking results
        flow2.on('end_stream', function() {
          input = util.concat(input);
          output = util.concat(output);

          expect(input).to.deep.equal(output);

          done();
        });

        // Start piping
        flow1.pipe(flow2).pipe(flow1);
      });
    });
  });
});
