describe('inputtypes', function() {
  var inputtypes;
  var cleanup;

  before(function(done) {

    var req = requirejs.config({
      context: Math.random().toString().slice(2),
      baseUrl: '../src',
      paths: {cleanup: '../test/cleanup'}
    });

    req(['inputtypes', 'cleanup'], function(_inputtypes, _cleanup) {
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
