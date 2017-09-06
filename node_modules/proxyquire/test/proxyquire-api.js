/*jshint asi:true*/
/*global describe, before, beforeEach, it */
'use strict';

var assert = require('assert')
  , realFoo = require('./samples/foo');

var stubs = {
  path:{
    extname:function () {},
    basename:function () {}
  }
};

describe('api', function () {
  describe('default export', function () {
    var proxyquire = require('..')

    it('proxyquire can load', function () {
      var proxiedFoo = proxyquire.load('./samples/foo', stubs);

      assert.equal(typeof proxiedFoo, 'object');
      assert.notStrictEqual(realFoo, proxiedFoo);
    });

    it('proxyquire can callThru and then load', function () {
      var proxiedFoo = proxyquire.callThru().load('./samples/foo', stubs);

      assert.equal(typeof proxiedFoo, 'object');
      assert.notStrictEqual(realFoo, proxiedFoo);
    });

    it('proxyquire can noCallThru and then load', function () {
      var proxiedFoo = proxyquire.noCallThru().load('./samples/foo', stubs);

      assert.equal(typeof proxiedFoo, 'object');
      assert.notStrictEqual(realFoo, proxiedFoo);
    });
  });
});
