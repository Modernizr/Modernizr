describe('inputs', function() {
  var inputs;
  var cleanup;

  before(function(done) {

    var req = requirejs.config({
      context: Math.random().toString().slice(2),
      baseUrl: '../src',
      paths: {cleanup: '../test/cleanup'}
    });

    req(['inputs', 'cleanup'], function(_inputs, _cleanup) {
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
