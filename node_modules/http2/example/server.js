var fs = require('fs');
var path = require('path');
var http2 = require('..');

// We cache one file to be able to do simple performance tests without waiting for the disk
var cachedFile = fs.readFileSync(path.join(__dirname, './server.js'));
var cachedUrl = '/server.js';

// The callback to handle requests
function onRequest(request, response) {
  var filename = path.join(__dirname, request.url);

  // Serving server.js from cache. Useful for microbenchmarks.
  if (request.url === cachedUrl) {
    if (response.push) {
      // Also push down the client js, since it's possible if the requester wants
      // one, they want both.
      var push = response.push('/client.js');
      push.writeHead(200);
      fs.createReadStream(path.join(__dirname, '/client.js')).pipe(push);
    }
    response.end(cachedFile);
  }

  // Reading file from disk if it exists and is safe.
  else if ((filename.indexOf(__dirname) === 0) && fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    response.writeHead(200);
    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(response);
    fileStream.on('finish',response.end);
  }

  // Example for testing large (boundary-sized) frames.
  else if (request.url === "/largeframe") {
    response.writeHead(200);
    var body = 'a';
    for (var i = 0; i < 14; i++) {
      body += body;
    }
    body = body + 'a';
    response.end(body);
  }

  // Otherwise responding with 404.
  else {
    response.writeHead(404);
    response.end();
  }
}

// Creating a bunyan logger (optional)
var log = require('../test/util').createLogger('server');

// Creating the server in plain or TLS mode (TLS mode is the default)
var server;
if (process.env.HTTP2_PLAIN) {
  server = http2.raw.createServer({
    log: log
  }, onRequest);
} else {
  server = http2.createServer({
    log: log,
    key: fs.readFileSync(path.join(__dirname, '/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, '/localhost.crt'))
  }, onRequest);
}
server.listen(process.env.HTTP2_PORT || 8080);
