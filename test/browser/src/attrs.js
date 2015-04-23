describe('attrs', function() {
  var attrs;
  var cleanup;

  before(function(done) {

    var req = requirejs.config({
      context: Math.random().toString().slice(2),
      baseUrl: '../src',
      paths: {cleanup: '../test/cleanup'}
    });

    req(['attrs', 'cleanup'], function(_attrs, _cleanup) {
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
