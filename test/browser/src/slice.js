describe('slice', function() {
  var slice;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['slice', 'cleanup'], function(_slice, _cleanup) {
      slice = _slice;
      cleanup = _cleanup;
      done();
    });
  });

  it('returns an instance of `slice`', function() {
    expect(slice).to.equal([].slice);
  });

  after(function() {
    cleanup();
  });
});
