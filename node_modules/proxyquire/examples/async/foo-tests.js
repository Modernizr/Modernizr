"use strict";

require('../example-utils').listModuleAndTests(__dirname + '/foo.js', __filename);

// Overriding callbacks that would normally be async will cause them to call back immediately
// Thus allowing you to run synchronous tests against async APIs.

var proxyquire   =  require('../..')
  , assert       =  require('assert')
  , readdirError =  new Error('some error')
  , fsStub       =  { }
  , calledBack
  ;

var foo = proxyquire('./foo', { fs: fsStub });

/*
* Test caps locking of returned files
*/
fsStub.readdir = function (dir, cb) { cb(null, [ 'file1', 'file2' ]); };

calledBack = false;
foo.filesAllCaps('./somedir', function (err, files) {
  assert.equal(err, null);
  assert.equal(files[0], 'FILE1');
  assert.equal(files[1], 'FILE2');
  
  calledBack = true;
});

// fs.readdir and thus filesAllCaps calls back before we get here, which means the code ran synchronously
assert(calledBack);

/*
* Test error propagation
*/
fsStub.readdir = function (dir, cb) { cb(readdirError); };

foo.filesAllCaps('./somedir', function (err, files) {
  assert.equal(err, readdirError);
});

console.log('*** All asserts passed ***');
