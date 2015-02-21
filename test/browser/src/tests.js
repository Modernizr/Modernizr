describe('tests', function() {
  var tests;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['tests', 'cleanup'], function(_tests, _cleanup) {
      tests = _tests;
      cleanup = _cleanup;
      done();
    });
  });


  it('is an array', function() {
    expect(tests).to.be.an('array');
  });

  after(function() {
    cleanup();
  });
});
