describe('domToCSS', function() {
  var domToCSS;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['domToCSS', 'cleanup'], function(_domToCSS, _cleanup) {
      domToCSS = _domToCSS;
      cleanup = _cleanup;
      done();
    });
  });

  it('converts kebab to camel', function() {
    expect(domToCSS('fakeDetect')).to.equal('fake-detect');
  });

  after(function() {
    cleanup();
  });
});
