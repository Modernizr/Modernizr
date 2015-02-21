describe('inputtypes', function() {
  var inputtypes;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['inputtypes', 'cleanup'], function(_inputtypes, _cleanup) {
      inputtypes = _inputtypes;
      cleanup = _cleanup;
      done();
    });
  });


  it('is an array', function() {
    expect(inputtypes).to.be.an('array');
  });

  after(function() {
    cleanup();
  });
});
