describe('Modernizr Base', function() {
  var modernizrBase;
  var cleanup;

  before(function(done) {

    define('package', [], function() {return {};});

    requirejs.config({
      baseUrl: '../src',
      paths: {cleanup: '../test/cleanup'}
    });

    requirejs(['Modernizr', 'cleanup'], function(_ModernizrBase, _cleanup) {
      modernizrBase = _ModernizrBase;
      cleanup = _cleanup;
      done();
    });
  });

  it('should return an object', function() {
    expect(modernizrBase).to.be.an('object');
  });

  after(function() {
    cleanup();
  });
});
