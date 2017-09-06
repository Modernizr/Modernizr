/*jshint asi:true*/
/*global describe, before, beforeEach, it */

"use strict";

var assert = require('assert');

describe("Proxyquire", function() {
  describe('load()', function() {
    it('defaults to preserving the cache', function() {
      var original = require('./samples/foo');
      original.state = 'cached';

      var proxyquire = require('..');
      var proxyFoo = proxyquire('./samples/foo', { 'path': { } });

      var foo = require('./samples/foo');
      assert.equal('cached', foo.state);
      assert.equal(foo, original);
    });
  });

  describe('preserveCache()', function() {
    it('returns a reference to itself, so it can be chained', function() {
      var proxyquire = require('..');
      assert.equal(proxyquire.preserveCache(), proxyquire);
    });

    it('has Proxyquire restore the cache for the module', function() {
      var original = require('./samples/foo');
      original.state = 'cached';

      var proxyquire = require('..');
      proxyquire.preserveCache();
      proxyquire.load('./samples/foo', { 'path': { } });

      var foo = require('./samples/foo');
      assert.equal('cached', foo.state);
      assert.equal(foo, original);
    });

    it('allows Singletons to function properly', function() {
      var original = require('./samples/foo-singleton').getInstance();

      var proxyquire = require('..');
      proxyquire.preserveCache();
      proxyquire.load('./samples/foo-singleton', { 'path': { } }).getInstance();

      var fooSingleton = require('./samples/foo-singleton').getInstance();
      assert.equal(fooSingleton, original);
    });
  });

  describe('noPreserveCache()', function() {
    it('returns a reference to itself, so it can be chained', function() {
      var proxyquire = require('..');
      assert.equal(proxyquire.noPreserveCache(), proxyquire);
    });

    it('forces subsequent requires to reload the proxied module', function() {
      var original = require('./samples/foo');
      original.state = 'cached';

      var proxyquire = require('..');
      proxyquire.load('./samples/foo', { 'path': { } });

      var cacheFoo = require('./samples/foo');
      assert.equal('cached', cacheFoo.state);
      assert.equal(cacheFoo, original);

      proxyquire.noPreserveCache();
      proxyquire.load('./samples/foo', { 'path': { } });
      var foo = require('./samples/foo');
      assert.equal('', foo.state);
      assert.notEqual(foo, original);
    });

    it('deletes the require.cache for the module being stubbed', function() {
      var proxyquire = require('..').noPreserveCache();

      var foo = proxyquire.load('./samples/foo', { 'path': { } });
      assert.equal(undefined, require.cache[require.resolve('./samples/foo')]);
    });

    it('deletes the require.cache for the stubs', function() {
      var proxyquire = require('..').noPreserveCache();

      var bar = {};
      var foo = proxyquire.load('./samples/cache/foo', { './bar': bar });
      bar.f.g = function () { return 'a' };
      bar.h = function () { return 'a' };

      assert.equal(foo.bar.f.g(), 'a')
      assert.equal(foo.bar.h(), 'a')

      foo = proxyquire.load('./samples/cache/foo', { './bar': {} });
      assert.equal(foo.bar.h(), 'h')
      assert.equal(foo.bar.f.g(), 'g')

      assert.equal(undefined, require.cache[require.resolve('./samples/cache/foo')]);
      assert.equal(undefined, require.cache[require.resolve('./samples/cache/bar')]);
    });

    it('silences errors when stub lookups fail', function() {
      var proxyquire = require('..').noPreserveCache();

      assert.doesNotThrow(function () {
        proxyquire.load('./samples/cache/foo', { './does-not-exist': {} });
      })
    });
  });
});