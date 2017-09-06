'use strict';

var fs = require('fs');
var pr = require('pull-request');
var readdirp = require('lsr').sync;

var TOKEN = JSON.parse(fs.readFileSync(__dirname + '/.release.json', 'utf8'));

// todo: check that the version is a new un-released version
// todo: check the user has commit access to the github repo
// todo: check the user is an owner in npm
// todo: check History.md has been updated

var version = require('./package.json').version;
var compiledWebsite = require('./docs/stop.js');

compiledWebsite.then(function () {
  var fileUpdates = readdirp(__dirname + '/docs/out').filter(function (info) {
    return info.isFile();
  }).map(function (info) {
    return {
      path: info.path.replace(/^\.\//, ''),
      content: fs.readFileSync(info.fullPath)
    };
  });
  return pr.commit('jadejs', 'jade', {
    branch: 'gh-pages',
    message: 'Update website for ' + version,
    updates: fileUpdates
  }, {auth: {type: 'oauth', token: TOKEN}});
}).then(function () {
  // todo: release the new npm package, set the tag and commit etc.
}).done(function () {
  console.log('website published');
});
