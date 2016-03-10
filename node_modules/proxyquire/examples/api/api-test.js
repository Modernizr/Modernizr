"use strict";

var assert = require('assert')
  , stats  = require('./samples/stats')
  , proxyquire = require('../..')
  , file = '/some/path/test.ext'
  , foo
  , fooCut
  , fooWild
  , cutBarStub = { bar: function () { return 'barber'; } }
  , wildBarStub = { bar: function () { return 'barbar'; } }
  ;
  
foo = proxyquire('./samples/foo', { });
fooCut = proxyquire('./samples/foo', { './bar': cutBarStub });
fooWild = proxyquire('./samples/foo', { './bar': wildBarStub });

assert.equal(stats.fooRequires(), 3);

assert.equal(foo.bigBar()     ,  'BAR');
assert.equal(fooCut.bigBar()  ,  'BARBER');
assert.equal(fooWild.bigBar() ,  'BARBAR');

// non overriden keys call thru by default
assert.equal(foo.bigRab()    ,  'RAB');
assert.equal(fooCut.bigRab() ,  'RAB');

// non overridden module path untouched
assert.equal(foo.bigExt(file)     ,  '.EXT');
assert.equal(fooCut.bigExt(file)  ,  '.EXT');
assert.equal(fooWild.bigExt(file) ,  '.EXT');
assert.equal(foo.bigBas(file)     ,  'TEST.EXT');
assert.equal(fooCut.bigBas(file)  ,  'TEST.EXT');
assert.equal(fooWild.bigBas(file) ,  'TEST.EXT');

// overriding keys after require works for both inline and non inline requires
cutBarStub.bar = function () { return 'friseur'; };
cutBarStub.rab = function () { return 'rabarber'; };

assert.equal(fooCut.bigBar(), 'FRISEUR');
assert.equal(fooCut.bigRab(), 'RABARBER');

// autofilling keys on delete only works for inline requires
cutBarStub.bar = undefined;
assert.equal(fooCut.bigBar(), 'BAR');

cutBarStub.rab = undefined;
assert.throws(fooCut.bigRab);


// turn off callThru feature via noCallThru
// not turned off
foo = proxyquire('./samples/foo', { 
    path: { 
        extname: function (file) { return 'Exterminate, exterminate the ' + file; }
      } 
  });

assert.equal(foo.bigExt(file),  'EXTERMINATE, EXTERMINATE THE /SOME/PATH/TEST.EXT');
assert.equal(foo.bigBas(file),  'TEST.EXT');

// turned off
foo = proxyquire('./samples/foo', { 
    path: { 
        extname: function (file) { return 'Exterminate, exterminate the ' + file; }
      , '@noCallThru': true
      } 
  });

assert.equal(foo.bigExt(file),  'EXTERMINATE, EXTERMINATE THE /SOME/PATH/TEST.EXT');
assert.throws(foo.bigBas);

// turned off globally
// not turned back on per module

foo = proxyquire
  .noCallThru()
  .load('./samples/foo', { 
    path: { 
        extname: function (file) { return 'Exterminate, exterminate the ' + file; }
      } 
  });

assert.throws(foo.bigBas);

// turned back on per module

foo = proxyquire
  .noCallThru()
  .load('./samples/foo', { 
    path: { 
        extname: function (file) { return 'Exterminate, exterminate the ' + file; }
      , '@noCallThru': false
      } 
  });

assert.equal(foo.bigBas(file),  'TEST.EXT');

// turned back on globally

foo = proxyquire
  .callThru()
  .load('./samples/foo', { 
    path: { 
        extname: function (file) { return 'Exterminate, exterminate the ' + file; }
      } 
  });

assert.equal(foo.bigBas(file),  'TEST.EXT');

// turned back off per module

foo = proxyquire
  .callThru()
  .load('./samples/foo', { 
    path: { 
        extname: function (file) { return 'Exterminate, exterminate the ' + file; }
      , '@noCallThru': true
      } 
  });

assert.throws(foo.bigBas);

console.log('*** All Asserts passed ***');
