describe('classes', function() {
  var classes;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['classes', 'cleanup'], function(_classes, _cleanup) {
      classes = _classes;
      cleanup = _cleanup;
      done();
    });
  });


  it('is an array', function() {
    expect(classes).to.be.an('array');
  });

  after(function() {
    cleanup();
  });
});
