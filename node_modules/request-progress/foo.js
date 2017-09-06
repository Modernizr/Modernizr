'use strict';

var request = require('request');
var replay = require('request-replay');
var progress = require('./');

progress(replay(request('http://download.virtualbox.org/virtualbox/5.0.10/VirtualBox-5.0.10-104061-OSX.dmg', function (err) {
    console.log('finish!', err);
})))
.on('socket', function (socket) {
    socket.setTimeout(10000, socket.end.bind(socket));
})
.on('replay', console.log.bind(console, 'replay'))
.on('progress', console.log.bind(console, 'progress'))
.on('error', console.log.bind(console, 'error'))
.on('end', console.log.bind(console, 'end'));
