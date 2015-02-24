describe('contains', function() {
  var contains;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['contains', 'cleanup'], function(_contains, _cleanup) {
      contains = _contains;
      cleanup = _cleanup;
      done();
    });
  });

  it('finds substrings', function() {
    expect(contains('fakeDetect', 'akeDet')).to.be(true);
  });

  after(function() {
    cleanup();
  });
});
