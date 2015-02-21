var root = require('find-parent-dir').sync(__dirname, 'package.json');
var expect = require('expect.js');
var Modernizr = require(root + 'lib/cli');


describe('cli', function() {

  it('exposes a build function', function() {
    expect(Modernizr.build).to.be.a('function');
  });

  it('exposes a metadata function', function() {
    expect(Modernizr.metadata).to.be.a('function');
  });

});
