var root = require('find-parent-dir').sync(__dirname, 'package.json');
var cp = require('child_process');
var Modernizr = require(root + 'lib/cli');
var chai = require('chai');
var expect = chai.expect;

describe('cli', function() {

  it('exposes a build function', function() {
    expect(Modernizr.build).to.be.a('function');
  });

  it('exposes a metadata function', function() {
    expect(Modernizr.metadata).to.be.a('function');
  });

  it('does not throw when being executed', function(done) {
    cp.exec('node ' + root + '/bin/modernizr -f adownload -d tmp/modernizr-test.js', done);
  });

  it('does not throw when setClasses is used as an option', function(done) {
    cp.exec('node ' + root + '/bin/modernizr -o setClasses -d tmp/modernizr-test.js', done);
  });
});
