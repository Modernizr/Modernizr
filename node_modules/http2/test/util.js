var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

function noop() {}
exports.noop = noop;

if (process.env.HTTP2_LOG) {
  var logOutput = process.stderr;
  if (process.stderr.isTTY) {
    var bin = path.resolve(path.dirname(require.resolve('bunyan')), '..', 'bin', 'bunyan');
    if(bin && fs.existsSync(bin)) {
      logOutput = spawn(bin, ['-o', 'short'], {
        stdio: [null, process.stderr, process.stderr]
      }).stdin;
    }
  }
  exports.createLogger = function(name) {
    return require('bunyan').createLogger({
      name: name,
      stream: logOutput,
      level: process.env.HTTP2_LOG,
      serializers: require('../lib/http').serializers
    });
  };
  exports.log = exports.createLogger('test');
  exports.clientLog = exports.createLogger('client');
  exports.serverLog = exports.createLogger('server');
} else {
  exports.createLogger = function() {
    return exports.log;
  };
  exports.log = exports.clientLog = exports.serverLog = {
    fatal: noop,
    error: noop,
    warn : noop,
    info : noop,
    debug: noop,
    trace: noop,

    child: function() { return this; }
  };
}

exports.callNTimes = function callNTimes(limit, done) {
  if (limit === 0) {
    done();
  } else {
    var i = 0;
    return function() {
      i += 1;
      if (i === limit) {
        done();
      }
    };
  }
};

// Concatenate an array of buffers into a new buffer
exports.concat = function concat(buffers) {
  var size = 0;
  for (var i = 0; i < buffers.length; i++) {
    size += buffers[i].length;
  }

  var concatenated = new Buffer(size);
  for (var cursor = 0, j = 0; j < buffers.length; cursor += buffers[j].length, j++) {
    buffers[j].copy(concatenated, cursor);
  }

  return concatenated;
};

exports.random = function random(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

// Concatenate an array of buffers and then cut them into random size buffers
exports.shuffleBuffers = function shuffleBuffers(buffers) {
  var concatenated = exports.concat(buffers), output = [], written = 0;

  while (written < concatenated.length) {
    var chunk_size = Math.min(concatenated.length - written, Math.ceil(Math.random()*20));
    output.push(concatenated.slice(written, written + chunk_size));
    written += chunk_size;
  }

  return output;
};
