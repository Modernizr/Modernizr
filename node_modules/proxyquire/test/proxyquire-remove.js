'use strict';
/*jshint asi:true*/
/*global describe, before, beforeEach, it */

var assert = require('assert')
  , proxyquire = require('..')
  , path = require('path')
  , fooPath = path.join(__dirname, './samples/foo.js')

describe('When resolving foo that requires nulled file package', function () {
  it('throws an error', function () {
    assert.throws(function () {
      proxyquire(fooPath, { path: null })
    })
  })
})

describe('When resolving foo that optionally requires nulled crypto package', function () {
  it('catches when resolving crypto', function () {
    var foo = proxyquire(fooPath, { crypto: null })
    assert.equal(foo.bigCrypto(), 'caught');
  })
})

