describe('smile', function() {
  var smile;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['smile', 'cleanup'], function(_smile, _cleanup) {
      smile = _smile;
      cleanup = _cleanup;
      done();
    });
  });

  it('returns a smiley', function() {
    expect(smile).to.equal(':)');
  });

  after(function() {
    cleanup();
  });
});
