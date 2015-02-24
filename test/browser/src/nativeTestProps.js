describe('nativeTestProps', function() {
  var nativeTestProps;
  var cleanup;

  before(function(done) {

    define('package', [], function() {return {};});

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['nativeTestProps', 'cleanup'], function(_nativeTestProps, _cleanup) {
      nativeTestProps = _nativeTestProps;
      cleanup = _cleanup;
      done();
    });
  });

  it('is a function', function() {
    expect(nativeTestProps).to.be.a('function');
  });

  if (window.CSS && window.CSS.supports) {
    it('looks up if the value is supported', function() {
      expect(nativeTestProps(['display'], 'block')).to.be(true);
      expect(nativeTestProps(['display'], 'fart')).to.be(false);
    });
  } else if ('CSSSupportsRule' in window) {
    it('supports the old version of the lookup',function() {
      expect(nativeTestProps(['display'], 'block')).to.be(true);
    });
  } else {
    it('returns undefined for browsers lacking support',function() {
      expect(nativeTestProps(['display'], 'block')).to.be(undefined);
    });
  }

  after(function() {
    cleanup();
  });
});
