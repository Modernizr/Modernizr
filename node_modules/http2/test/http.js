var expect = require('chai').expect;
var util = require('./util');
var fs = require('fs');
var path = require('path');
var url = require('url');
var net = require('net');

var http2 = require('../lib/http');
var https = require('https');

var serverOptions = {
  key: fs.readFileSync(path.join(__dirname, '../example/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '../example/localhost.crt')),
  rejectUnauthorized: true,
  log: util.serverLog
};

var agentOptions = {
  key: serverOptions.key,
  ca: serverOptions.cert,
  rejectUnauthorized: true,
  log: util.clientLog
};

var globalAgent = new http2.Agent(agentOptions);

describe('http.js', function() {
  beforeEach(function() {
    http2.globalAgent = globalAgent;
  });
  describe('Server', function() {
    describe('new Server(options)', function() {
      it('should throw if called without \'plain\' or TLS options', function() {
        expect(function() {
          new http2.Server();
        }).to.throw(Error);
        expect(function() {
          http2.createServer(util.noop);
        }).to.throw(Error);
      });
    });
    describe('method `listen()`', function () {
      it('should emit `listening` event', function (done) {
        var server = http2.createServer(serverOptions);

        server.on('listening', function () {
          server.close();

          done();
        })

        server.listen(0);
      });
      it('should emit `error` on failure', function (done) {
        var server = http2.createServer(serverOptions);

        // This TCP server is used to explicitly take a port to make
        // server.listen() fails.
        var net = require('net').createServer();

        server.on('error', function () {
          net.close()

          done();
        });

        net.listen(0, function () {
          server.listen(this.address().port);
        });
      });
    });
    describe('property `timeout`', function() {
      it('should be a proxy for the backing HTTPS server\'s `timeout` property', function() {
        var server = new http2.Server(serverOptions);
        var backingServer = server._server;
        var newTimeout = 10;
        server.timeout = newTimeout;
        expect(server.timeout).to.be.equal(newTimeout);
        expect(backingServer.timeout).to.be.equal(newTimeout);
      });
    });
    describe('method `setTimeout(timeout, [callback])`', function() {
      it('should be a proxy for the backing HTTPS server\'s `setTimeout` method', function() {
        var server = new http2.Server(serverOptions);
        var backingServer = server._server;
        var newTimeout = 10;
        var newCallback = util.noop;
        backingServer.setTimeout = function(timeout, callback) {
          expect(timeout).to.be.equal(newTimeout);
          expect(callback).to.be.equal(newCallback);
        };
        server.setTimeout(newTimeout, newCallback);
      });
    });
  });
  describe('Agent', function() {
    describe('property `maxSockets`', function() {
      it('should be a proxy for the backing HTTPS agent\'s `maxSockets` property', function() {
        var agent = new http2.Agent({ log: util.clientLog });
        var backingAgent = agent._httpsAgent;
        var newMaxSockets = backingAgent.maxSockets + 1;
        agent.maxSockets = newMaxSockets;
        expect(agent.maxSockets).to.be.equal(newMaxSockets);
        expect(backingAgent.maxSockets).to.be.equal(newMaxSockets);
      });
    });
    describe('method `request(options, [callback])`', function() {
      it('should use a new agent for request-specific TLS settings', function(done) {
        var path = '/x';
        var message = 'Hello world';

        var server = http2.createServer(serverOptions, function(request, response) {
          expect(request.url).to.equal(path);
          response.end(message);
        });

        server.listen(1234, function() {
          var options = url.parse('https://localhost:1234' + path);
          options.key = agentOptions.key;
          options.ca = agentOptions.ca;
          options.rejectUnauthorized = true;

          http2.globalAgent = new http2.Agent({ log: util.clientLog });
          http2.get(options, function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              server.close();
              done();
            });
          });
        });
      });
      it('should throw when trying to use with \'http\' scheme', function() {
        expect(function() {
          var agent = new http2.Agent({ log: util.clientLog });
          agent.request({ protocol: 'http:' });
        }).to.throw(Error);
      });
    });
  });
  describe('OutgoingRequest', function() {
    function testFallbackProxyMethod(name, originalArguments, done) {
      var request = new http2.OutgoingRequest();

      // When in HTTP/2 mode, this call should be ignored
      request.stream = { reset: util.noop };
      request[name].apply(request, originalArguments);
      delete request.stream;

      // When in fallback mode, this call should be forwarded
      request[name].apply(request, originalArguments);
      var mockFallbackRequest = { on: util.noop };
      mockFallbackRequest[name] = function() {
        expect(Array.prototype.slice.call(arguments)).to.deep.equal(originalArguments);
        done();
      };
      request._fallback(mockFallbackRequest);
    }
    describe('method `setNoDelay(noDelay)`', function() {
      it('should act as a proxy for the backing HTTPS agent\'s `setNoDelay` method', function(done) {
        testFallbackProxyMethod('setNoDelay', [true], done);
      });
    });
    describe('method `setSocketKeepAlive(enable, initialDelay)`', function() {
      it('should act as a proxy for the backing HTTPS agent\'s `setSocketKeepAlive` method', function(done) {
        testFallbackProxyMethod('setSocketKeepAlive', [true, util.random(10, 100)], done);
      });
    });
    describe('method `setTimeout(timeout, [callback])`', function() {
      it('should act as a proxy for the backing HTTPS agent\'s `setTimeout` method', function(done) {
        testFallbackProxyMethod('setTimeout', [util.random(10, 100), util.noop], done);
      });
    });
    describe('method `abort()`', function() {
      it('should act as a proxy for the backing HTTPS agent\'s `abort` method', function(done) {
        testFallbackProxyMethod('abort', [], done);
      });
    });
  });
  describe('OutgoingResponse', function() {
    it('should throw error when writeHead is called multiple times on it', function() {
      var called = false;
      var stream = { _log: util.log, headers: function () {
        if (called) {
          throw new Error('Should not send headers twice');
        } else {
          called = true;
        }
      }, once: util.noop };
      var response = new http2.OutgoingResponse(stream);

      response.writeHead(200);
      response.writeHead(404);
    });
    it('field finished should be Boolean', function(){
      var stream = { _log: util.log, headers: function () {}, once: util.noop };
      var response = new http2.OutgoingResponse(stream);
      expect(response.finished).to.be.a('Boolean');
    });
    it('field finished should initially be false and then go to true when response completes',function(done){
      var res;
      var server = http2.createServer(serverOptions, function(request, response) {
        res = response;
        expect(res.finished).to.be.false;
        response.end('HiThere');
      });
      server.listen(1236, function() {
        http2.get('https://localhost:1236/finished-test', function(response) {
          response.on('data', function(data){
            var sink = data; //
          });
          response.on('end',function(){
            expect(res.finished).to.be.true;
            server.close();
            done();
          });
        });
      });
    });
  });
  describe('test scenario', function() {
    describe('simple request', function() {
      it('should work as expected', function(done) {
        var path = '/x';
        var message = 'Hello world';

        var server = http2.createServer(serverOptions, function(request, response) {
          expect(request.url).to.equal(path);
          response.end(message);
        });

        server.listen(1234, function() {
          http2.get('https://localhost:1234' + path, function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              server.close();
              done();
            });
          });
        });
      });
    });
    describe('2 simple request in parallel', function() {
      it('should work as expected', function(originalDone) {
        var path = '/x';
        var message = 'Hello world';
        var done = util.callNTimes(2, function() {
          server.close();
          originalDone();
        });

        var server = http2.createServer(serverOptions, function(request, response) {
          expect(request.url).to.equal(path);
          response.end(message);
        });

        server.listen(1234, function() {
          http2.get('https://localhost:1234' + path, function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              done();
            });
          });
          http2.get('https://localhost:1234' + path, function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              done();
            });
          });
        });
      });
    });
    describe('100 simple request in a series', function() {
      it('should work as expected', function(done) {
        var path = '/x';
        var message = 'Hello world';

        var server = http2.createServer(serverOptions, function(request, response) {
          expect(request.url).to.equal(path);
          response.end(message);
        });

        var n = 100;
        server.listen(1242, function() {
          doRequest();
          function doRequest() {
            http2.get('https://localhost:1242' + path, function(response) {
              response.on('data', function(data) {
                expect(data.toString()).to.equal(message);
                if (n) {
                  n -= 1;
                  doRequest();
                } else {
                  server.close();
                  done();
                }
              });
            });
          }
        });
      });
    });
    describe('request with payload', function() {
      it('should work as expected', function(done) {
        var path = '/x';
        var message = 'Hello world';

        var server = http2.createServer(serverOptions, function(request, response) {
          expect(request.url).to.equal(path);
          request.once('data', function(data) {
            expect(data.toString()).to.equal(message);
            response.end();
          });
        });

        server.listen(1240, function() {
          var request = http2.request({
            host: 'localhost',
            port: 1240,
            path: path
          });
          request.write(message);
          request.end();
          request.on('response', function() {
            server.close();
            done();
          });
        });
      });
    });
    describe('request with custom status code and headers', function() {
      it('should work as expected', function(done) {
        var path = '/x';
        var message = 'Hello world';
        var headerName = 'name';
        var headerValue = 'value';

        var server = http2.createServer(serverOptions, function(request, response) {
          // Request URL and headers
          expect(request.url).to.equal(path);
          expect(request.headers[headerName]).to.equal(headerValue);

          // A header to be overwritten later
          response.setHeader(headerName, 'to be overwritten');
          expect(response.getHeader(headerName)).to.equal('to be overwritten');

          // A header to be deleted
          response.setHeader('nonexistent', 'x');
          response.removeHeader('nonexistent');
          expect(response.getHeader('nonexistent')).to.equal(undefined);

          // Don't send date
          response.sendDate = false;

          // Specifying more headers, the status code and a reason phrase with `writeHead`
          var moreHeaders = {};
          moreHeaders[headerName] = headerValue;
          response.writeHead(600, 'to be discarded', moreHeaders);
          expect(response.getHeader(headerName)).to.equal(headerValue);

          // Empty response body
          response.end(message);
        });

        server.listen(1239, function() {
          var headers = {};
          headers[headerName] = headerValue;
          var request = http2.request({
            host: 'localhost',
            port: 1239,
            path: path,
            headers: headers
          });
          request.end();
          request.on('response', function(response) {
            expect(response.headers[headerName]).to.equal(headerValue);
            expect(response.headers['nonexistent']).to.equal(undefined);
            expect(response.headers['date']).to.equal(undefined);
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              server.close();
              done();
            });
          });
        });
      });
    });
    describe('request over plain TCP', function() {
      it('should work as expected', function(done) {
        var path = '/x';
        var message = 'Hello world';

        var server = http2.raw.createServer({
          log: util.serverLog
        }, function(request, response) {
          expect(request.url).to.equal(path);
          response.end(message);
        });

        server.listen(1237, function() {
          var request = http2.raw.request({
            plain: true,
            host: 'localhost',
            port: 1237,
            path: path
          }, function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              server.close();
              done();
            });
          });
          request.end();
        });
      });
    });
    describe('get over plain TCP', function() {
      it('should work as expected', function(done) {
        var path = '/x';
        var message = 'Hello world';

        var server = http2.raw.createServer({
          log: util.serverLog
        }, function(request, response) {
          expect(request.url).to.equal(path);
          response.end(message);
        });

        server.listen(1237, function() {
          var request = http2.raw.get('http://localhost:1237/x', function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              server.close();
              done();
            });
          });
          request.end();
        });
      });
    });
    describe('request to an HTTPS/1 server', function() {
      it('should fall back to HTTPS/1 successfully', function(done) {
        var path = '/x';
        var message = 'Hello world';

        var server = https.createServer(serverOptions, function(request, response) {
          expect(request.url).to.equal(path);
          response.end(message);
        });

        server.listen(5678, function() {
          http2.get('https://localhost:5678' + path, function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              done();
            });
          });
        });
      });
    });
    describe('2 parallel request to an HTTPS/1 server', function() {
      it('should fall back to HTTPS/1 successfully', function(originalDone) {
        var path = '/x';
        var message = 'Hello world';
        var done = util.callNTimes(2, function() {
          server.close();
          originalDone();
        });

        var server = https.createServer(serverOptions, function(request, response) {
          expect(request.url).to.equal(path);
          response.end(message);
        });

        server.listen(6789, function() {
          http2.get('https://localhost:6789' + path, function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              done();
            });
          });
          http2.get('https://localhost:6789' + path, function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              done();
            });
          });
        });
      });
    });
    describe('HTTPS/1 request to a HTTP/2 server', function() {
      it('should fall back to HTTPS/1 successfully', function(done) {
        var path = '/x';
        var message = 'Hello world';

        var server = http2.createServer(serverOptions, function(request, response) {
          expect(request.url).to.equal(path);
          response.end(message);
        });

        server.listen(1236, function() {
          var options = url.parse('https://localhost:1236' + path);
          options.agent = new https.Agent(agentOptions);
          https.get(options, function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              done();
            });
          });
        });
      });
    });
    describe('two parallel request', function() {
      it('should work as expected', function(done) {
        var path = '/x';
        var message = 'Hello world';

        var server = http2.createServer(serverOptions, function(request, response) {
          expect(request.url).to.equal(path);
          response.end(message);
        });

        server.listen(1237, function() {
          done = util.callNTimes(2, done);
          // 1. request
          http2.get('https://localhost:1237' + path, function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              done();
            });
          });
          // 2. request
          http2.get('https://localhost:1237' + path, function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              done();
            });
          });
        });
      });
    });
    describe('two subsequent request', function() {
      it('should use the same HTTP/2 connection', function(done) {
        var path = '/x';
        var message = 'Hello world';

        var server = http2.createServer(serverOptions, function(request, response) {
          expect(request.url).to.equal(path);
          response.end(message);
        });

        server.listen(1238, function() {
          // 1. request
          http2.get('https://localhost:1238' + path, function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);

              // 2. request
              http2.get('https://localhost:1238' + path, function(response) {
                response.on('data', function(data) {
                  expect(data.toString()).to.equal(message);
                  done();
                });
              });
            });
          });
        });
      });
    });
    describe('https server node module specification conformance', function() {
      it('should provide API for remote HTTP 1.1 client address', function(done) {
        var remoteAddress = null;
        var remotePort = null;

        var server = http2.createServer(serverOptions, function(request, response) {
          // HTTPS 1.1 client with Node 0.10 server
          if (!request.remoteAddress) {
            if (request.socket.socket) {
              remoteAddress = request.socket.socket.remoteAddress;
              remotePort = request.socket.socket.remotePort;
            } else {
              remoteAddress = request.socket.remoteAddress;
              remotePort = request.socket.remotePort;
            }
          } else {
            // HTTPS 1.1/2.0 client with Node 0.12 server
            remoteAddress = request.remoteAddress;
            remotePort = request.remotePort;
          }
          response.write('Pong');
          response.end();
        });

        server.listen(1259, 'localhost', function() {
          var request = https.request({
            host: 'localhost',
            port: 1259,
            path: '/',
            ca: serverOptions.cert
          });
          request.write('Ping');
          request.end();
          request.on('response', function(response) {
            response.on('data', function(data) {
              var localAddress = response.socket.address();
              expect(remoteAddress).to.equal(localAddress.address);
              expect(remotePort).to.equal(localAddress.port);
              server.close();
              done();
            });
          });
        });
      });
      it('should provide API for remote HTTP 2.0 client address', function(done) {
        var remoteAddress = null;
        var remotePort = null;
        var localAddress = null;

        var server = http2.createServer(serverOptions, function(request, response) {
          remoteAddress = request.remoteAddress;
          remotePort = request.remotePort;
          response.write('Pong');
          response.end();
        });

        server.listen(1258, 'localhost', function() {
          var request = http2.request({
            host: 'localhost',
            port: 1258,
            path: '/'
          });
          request.write('Ping');
          globalAgent.on('false:localhost:1258', function(endpoint) {
            localAddress = endpoint.socket.address();
          });
          request.end();
          request.on('response', function(response) {
            response.on('data', function(data) {
              expect(remoteAddress).to.equal(localAddress.address);
              expect(remotePort).to.equal(localAddress.port);
              server.close();
              done();
            });
          });
        });
      });
      it('should expose net.Socket as .socket and .connection', function(done) {
        var server = http2.createServer(serverOptions, function(request, response) {
          expect(request.socket).to.equal(request.connection);
          expect(request.socket).to.be.instanceof(net.Socket);
          response.write('Pong');
          response.end();
          done();
        });

        server.listen(1248, 'localhost', function() {
          var request = https.request({
            host: 'localhost',
            port: 1248,
            path: '/',
            ca: serverOptions.cert
          });
          request.write('Ping');
          request.end();
        });
      });
    });
    describe('request and response with trailers', function() {
      it('should work as expected', function(done) {
        var path = '/x';
        var message = 'Hello world';
        var requestTrailers = { 'content-md5': 'x' };
        var responseTrailers = { 'content-md5': 'y' };

        var server = http2.createServer(serverOptions, function(request, response) {
          expect(request.url).to.equal(path);
          request.on('data', util.noop);
          request.once('end', function() {
            expect(request.trailers).to.deep.equal(requestTrailers);
            response.write(message);
            response.addTrailers(responseTrailers);
            response.end();
          });
        });

        server.listen(1241, function() {
          var request = http2.request('https://localhost:1241' + path);
          request.addTrailers(requestTrailers);
          request.end();
          request.on('response', function(response) {
            response.on('data', util.noop);
            response.once('end', function() {
              expect(response.trailers).to.deep.equal(responseTrailers);
              done();
            });
          });
        });
      });
    });
    describe('Handle socket error', function () {
      it('HTTPS on Connection Refused error', function (done) {
        var path = '/x';
        var request = http2.request('https://127.0.0.1:6666' + path);

        request.on('error', function (err) {
          expect(err.errno).to.equal('ECONNREFUSED');
          done();
        });

        request.on('response', function (response) {
          server._server._handle.destroy();

          response.on('data', util.noop);

          response.once('end', function () {
            done(new Error('Request should have failed'));
          });
        });

        request.end();

      });
      it('HTTP on Connection Refused error', function (done) {
        var path = '/x';

        var request = http2.raw.request('http://127.0.0.1:6666' + path);

        request.on('error', function (err) {
          expect(err.errno).to.equal('ECONNREFUSED');
          done();
        });

        request.on('response', function (response) {
          server._server._handle.destroy();

          response.on('data', util.noop);

          response.once('end', function () {
            done(new Error('Request should have failed'));
          });
        });

        request.end();
      });
    });
    describe('server push', function() {
      it('should work as expected', function(done) {
        var path = '/x';
        var message = 'Hello world';
        var pushedPath = '/y';
        var pushedMessage = 'Hello world 2';

        var server = http2.createServer(serverOptions, function(request, response) {
          expect(request.url).to.equal(path);
          var push1 = response.push('/y');
          push1.end(pushedMessage);
          var push2 = response.push({ path: '/y', protocol: 'https:' });
          push2.end(pushedMessage);
          response.end(message);
        });

        server.listen(1235, function() {
          var request = http2.get('https://localhost:1235' + path);
          done = util.callNTimes(5, done);

          request.on('response', function(response) {
            response.on('data', function(data) {
              expect(data.toString()).to.equal(message);
              done();
            });
            response.on('end', done);
          });

          request.on('push', function(promise) {
            expect(promise.url).to.be.equal(pushedPath);
            promise.on('response', function(pushStream) {
              pushStream.on('data', function(data) {
                expect(data.toString()).to.equal(pushedMessage);
                done();
              });
              pushStream.on('end', done);
            });
          });
        });
      });
    });
  });
});
