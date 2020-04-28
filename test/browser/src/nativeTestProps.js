describe('nativeTestProps', function() {
  var nativeTestProps;

  var nativeSupport = window.CSS && window.CSS.supports
  eval(makeIIFE({file: "./src/nativeTestProps.js", func: 'nativeTestProps'}))

  it('is a function', function() {
    expect(nativeTestProps).to.be.a('function');
  });

  if (nativeSupport) {
    it('looks up if the value is supported', function() {
      expect(nativeTestProps(['display'], 'block')).to.be.equal(true);
      expect(nativeTestProps(['display'], 'fart')).to.be.equal(false);
    });
  }

  describe('', function() {
    var originalRef

    before(function() {
      if (nativeSupport) {
        originalRef = window.CSS
        window.CSS = {}
      }
    })

    it('returns undefined for browsers lacking support', function() {
      expect(nativeTestProps(['display'], 'block')).to.be.equal(undefined);
    });

    after(function() {
      if (nativeSupport) {
        window.CSS = originalRef
      }
    })
  })

});
