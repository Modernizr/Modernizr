describe('inputs', function() {
  var inputs;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['inputs', 'cleanup'], function(_inputs, _cleanup) {
      inputs = _inputs;
      cleanup = _cleanup;
      done();
    });
  });


  it('is an object', function() {
    expect(inputs).to.be.an('object');
  });

  after(function() {
    cleanup();
  });
});
