describe('smile', function() {
  var smile;
  var cleanup;

  before(function(done) {

    var req = requirejs.config({
      context: Math.random().toString().slice(2),
      baseUrl: '../src',
      paths: {cleanup: '../test/cleanup'}
    });

    req(['smile', 'cleanup'], function(_smile, _cleanup) {
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
