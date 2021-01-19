describe('modElem', function() {
  // we are mocking out the module interface, not the Modernizr api
  var Modernizr = {ModernizrProto: {_q: []}};
  var modElem;

  eval(makeIIFE({file: "./src/modElem.js", func: 'modElem', external: ['./Modernizr.js'] }))

  it('returns an object with an `elem` prop', function() {
    expect(modElem).to.be.an('object');
    expect(modElem.elem).to.not.be.equal(undefined);
    expect(modElem.elem.nodeName.toUpperCase()).to.be.equal('MODERNIZR');
  });

  it('pushes a function onto the Modernizr._q', function() {
    expect(Modernizr.ModernizrProto._q[0]).to.be.a('function');
  });

  it('deletes modElem.style after the `_q` runs', function() {
    expect(modElem.elem).to.not.be.equal(undefined);
    Modernizr.ModernizrProto._q[0]();
    expect(modElem.elem).to.be.equal(undefined);
  });

});
