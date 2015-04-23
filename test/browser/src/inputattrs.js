describe('inputattrs', function() {
  var inputattrs;
  var cleanup;

  before(function(done) {

    var req = requirejs.config({
      context: Math.random().toString().slice(2),
      baseUrl: '../src',
      paths: {cleanup: '../test/cleanup'}
    });

    req(['inputattrs', 'cleanup'], function(_inputattrs, _cleanup) {
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
