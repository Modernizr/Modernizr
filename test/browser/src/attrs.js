describe('attrs', function() {
  var attrs;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['attrs', 'cleanup'], function(_attrs, _cleanup) {
      attrs = _attrs;
      cleanup = _cleanup;
      done();
    });
  });


  it('is an object', function() {
    expect(attrs).to.be.an('object');
  });

  after(function() {
    cleanup();
  });
});
