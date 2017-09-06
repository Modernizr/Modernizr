'use strict';
/*jshint asi:true */
/*global describe, before, beforeEach, it */

var proxyquire = require('..');

describe('when I try to use compat mode', function () {

  it('should let me know that I need to fix my code or downgrade', function () {
    proxyquire.compat.should.throw(/compat mode has been removed/);
  });
});
