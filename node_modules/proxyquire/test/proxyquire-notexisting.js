'use strict';
/*jshint asi:true*/
/*global describe, before, beforeEach, it */

var assert = require('assert')
  , proxyquire = require('..')
  , path = require('path')
  , fooPath = path.join(__dirname, './samples/notexisting/foo.js')

describe('When resolving foo that requires stubbed /not/existing/bar.json', function () { 
  
  it('throws an error', function () {
    assert.throws(function () {
      proxyquire(fooPath, {
        '/not/existing/bar.json': { config: 'bar\'s config' } 
      })  
    })
  })
})

describe('When resolving foo that requires stubbed /not/existing/bar.json with noCallThru', function () { 
  var foo;

  it('resolves foo with stubbed bar', function () {
    foo = proxyquire(fooPath, {
      '/not/existing/bar.json': { config: 'bar\'s config', '@noCallThru': true } 
    })  
    assert.equal(foo.config, 'bar\'s config')
  })
})
