describe('omPrefixes', function() {
  var omPrefixes;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['omPrefixes', 'cleanup'], function(_omPrefixes, _cleanup) {
      omPrefixes = _omPrefixes;
      cleanup = _cleanup;
      done();
    });
  });

  it('returns a string', function() {
    expect(omPrefixes).to.be.a('string');
    expect(omPrefixes.length).to.not.be(0);
  });

  after(function() {
    cleanup();
  });
});
