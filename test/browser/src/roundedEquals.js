describe('roundedEquals', function() {
  var roundedEquals;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['roundedEquals', 'cleanup'], function(_roundedEquals, _cleanup) {
      roundedEquals = _roundedEquals;
      cleanup = _cleanup;
      done();
    });
  });

  it('works', function() {
    expect(roundedEquals(1, 2)).to.be(true);
    expect(roundedEquals(2, 2)).to.be(true);
    expect(roundedEquals(3, 2)).to.be(true);
  });

  after(function() {
    cleanup();
  });
});
