'use strict';
require('../example-utils').listModuleAndTests(__dirname + '/foo.js', __filename);

var proxyquire = require('../..')
  , assert = require('assert')
  , foo
  ;

// no overrides yet, so path.extname behaves normally
foo = proxyquire('./foo', {});
assert.equal(foo.extnameAllCaps('file.txt'), '.TXT');

// override path.extname
foo = proxyquire('./foo', {
  path: { extname: function (file) { return 'Exterminate, exterminate the ' + file; } }
});

// path.extname now behaves as we told it to
assert.equal(foo.extnameAllCaps('file.txt'), 'EXTERMINATE, EXTERMINATE THE FILE.TXT');

// path.basename on the other hand still functions as before
assert.equal(foo.basenameAllCaps('/a/b/file.txt'), 'FILE.TXT');

console.log('*** All asserts passed ***');
