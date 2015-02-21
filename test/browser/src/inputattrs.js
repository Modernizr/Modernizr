describe('inputattrs', function() {
  var inputattrs;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['inputattrs', 'cleanup'], function(_inputattrs, _cleanup) {
      inputattrs = _inputattrs;
      cleanup = _cleanup;
      done();
    });
  });


  it('is an array', function() {
    expect(inputattrs).to.be.an('array');
  });

  after(function() {
    cleanup();
  });
});
