describe('prefixedCSS', function() {
  var prefixedCSS;

  // we are mocking out the module interface, not the Modernizr api
  var Modernizr = {ModernizrProto: {_config: {usePrefixes: true}, _q: []}};
  eval(makeIIFE({file: "./src/prefixedCSS.js", func: 'prefixedCSS', external: ['./Modernizr.js']}))

  it('creates a reference on `ModernizrProto`', function() {
    expect(prefixedCSS).to.be.equal(Modernizr.ModernizrProto.prefixedCSS);
  });

  it('returns false on unknown properties', function() {
    expect(prefixedCSS('fart')).to.be.equal(false);
  });

  it('returns known values without prefix', function() {
    expect(prefixedCSS('display')).to.be.equal('display');
  });

});
