var expect = require('chai').expect;
var util = require('./util');

var Connection = require('../lib/protocol/connection').Connection;

var settings = {
  SETTINGS_MAX_CONCURRENT_STREAMS: 100,
  SETTINGS_INITIAL_WINDOW_SIZE: 100000
};

var MAX_PRIORITY = Math.pow(2, 31) - 1;
var MAX_RANDOM_PRIORITY = 10;

function randomPriority() {
  return Math.floor(Math.random() * (MAX_RANDOM_PRIORITY + 1));
}

function expectPriorityOrder(priorities) {
  priorities.forEach(function(bucket, priority) {
    bucket.forEach(function(stream) {
      expect(stream._priority).to.be.equal(priority);
    });
  });
}

describe('connection.js', function() {
  describe('Connection class', function() {
    describe('method ._insert(stream)', function() {
      it('should insert the stream in _streamPriorities in a place determined by stream._priority', function() {
        var streams = [];
        var connection = Object.create(Connection.prototype, { _streamPriorities: { value: streams }});
        var streamCount = 10;

        for (var i = 0; i < streamCount; i++) {
          var stream = { _priority: randomPriority() };
          connection._insert(stream, stream._priority);
          expect(connection._streamPriorities[stream._priority]).to.include(stream);
        }

        expectPriorityOrder(connection._streamPriorities);
      });
    });
    describe('method ._reprioritize(stream)', function() {
      it('should eject and then insert the stream in _streamPriorities in a place determined by stream._priority', function() {
        var streams = [];
        var connection = Object.create(Connection.prototype, { _streamPriorities: { value: streams }});
        var streamCount = 10;
        var oldPriority, newPriority, stream;

        for (var i = 0; i < streamCount; i++) {
          oldPriority = randomPriority();
          while ((newPriority = randomPriority()) === oldPriority);
          stream = { _priority: oldPriority };
          connection._insert(stream, oldPriority);
          connection._reprioritize(stream, newPriority);
          stream._priority = newPriority;

          expect(connection._streamPriorities[newPriority]).to.include(stream);
          expect(connection._streamPriorities[oldPriority] || []).to.not.include(stream);
        }

        expectPriorityOrder(streams);
      });
    });
    describe('invalid operation', function() {
      describe('unsolicited ping answer', function() {
        it('should be ignored', function() {
          var connection = new Connection(util.log, 1, settings);

          connection._receivePing({
            stream: 0,
            type: 'PING',
            flags: {
              'PONG': true
            },
            data: new Buffer(8)
          });
        });
      });
    });
  });
  describe('test scenario', function() {
    var c, s;
    beforeEach(function() {
      c = new Connection(util.log.child({ role: 'client' }), 1, settings);
      s = new Connection(util.log.child({ role: 'client' }), 2, settings);
      c.pipe(s).pipe(c);
    });

    describe('connection setup', function() {
      it('should work as expected', function(done) {
        setTimeout(function() {
          // If there are no exception until this, then we're done
          done();
        }, 10);
      });
    });
    describe('sending/receiving a request', function() {
      it('should work as expected', function(done) {
        // Request and response data
        var request_headers = {
          ':method': 'GET',
          ':path': '/'
        };
        var request_data = new Buffer(0);
        var response_headers = {
          ':status': '200'
        };
        var response_data = new Buffer('12345678', 'hex');

        // Setting up server
        s.on('stream', function(server_stream) {
          server_stream.on('headers', function(headers) {
            expect(headers).to.deep.equal(request_headers);
            server_stream.headers(response_headers);
            server_stream.end(response_data);
          });
        });

        // Sending request
        var client_stream = c.createStream();
        client_stream.headers(request_headers);
        client_stream.end(request_data);

        // Waiting for answer
        done = util.callNTimes(2, done);
        client_stream.on('headers', function(headers) {
          expect(headers).to.deep.equal(response_headers);
          done();
        });
        client_stream.on('data', function(data) {
          expect(data).to.deep.equal(response_data);
          done();
        });
      });
    });
    describe('server push', function() {
      it('should work as expected', function(done) {
        var request_headers = { ':method': 'get', ':path': '/' };
        var response_headers = { ':status': '200' };
        var push_request_headers = { ':method': 'get', ':path': '/x' };
        var push_response_headers = { ':status': '200' };
        var response_content = new Buffer(10);
        var push_content = new Buffer(10);

        done = util.callNTimes(5, done);

        s.on('stream', function(response) {
          response.headers(response_headers);

          var pushed = response.promise(push_request_headers);
          pushed.headers(push_response_headers);
          pushed.end(push_content);

          response.end(response_content);
        });

        var request = c.createStream();
        request.headers(request_headers);
        request.end();
        request.on('headers', function(headers) {
          expect(headers).to.deep.equal(response_headers);
          done();
        });
        request.on('data', function(data) {
          expect(data).to.deep.equal(response_content);
          done();
        });
        request.on('promise', function(pushed, headers) {
          expect(headers).to.deep.equal(push_request_headers);
          pushed.on('headers', function(headers) {
            expect(headers).to.deep.equal(response_headers);
            done();
          });
          pushed.on('data', function(data) {
            expect(data).to.deep.equal(push_content);
            done();
          });
          pushed.on('end', done);
        });
      });
    });
    describe('ping from client', function() {
      it('should work as expected', function(done) {
        c.ping(function() {
          done();
        });
      });
    });
    describe('ping from server', function() {
      it('should work as expected', function(done) {
        s.ping(function() {
          done();
        });
      });
    });
    describe('creating two streams and then using them in reverse order', function() {
      it('should not result in non-monotonous local ID ordering', function() {
        var s1 = c.createStream();
        var s2 = c.createStream();
        s2.headers({ ':method': 'get', ':path': '/' });
        s1.headers({ ':method': 'get', ':path': '/' });
      });
    });
    describe('creating two promises and then using them in reverse order', function() {
      it('should not result in non-monotonous local ID ordering', function(done) {
        s.on('stream', function(response) {
          response.headers({ ':status': '200' });

          var p1 = s.createStream();
          var p2 = s.createStream();
          response.promise(p2, { ':method': 'get', ':path': '/p2' });
          response.promise(p1, { ':method': 'get', ':path': '/p1' });
          p2.headers({ ':status': '200' });
          p1.headers({ ':status': '200' });
        });

        var request = c.createStream();
        request.headers({ ':method': 'get', ':path': '/' });

        done = util.callNTimes(2, done);
        request.on('promise', function() {
          done();
        });
      });
    });
    describe('closing the connection on one end', function() {
      it('should result in closed streams on both ends', function(done) {
        done = util.callNTimes(2, done);
        c.on('end', done);
        s.on('end', done);

        c.close();
      });
    });
  });
});
