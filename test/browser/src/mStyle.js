describe('mStyle', function() {
  var Modernizr = {ModernizrProto: {_q: []}};
  var mStyle;

  eval(makeIIFE({file: "./src/mStyle.js", func: 'mStyle', external: ['./Modernizr.js'] }))

  it('returns an object with a style prop', function() {
    expect(mStyle).to.be.an('object');
    expect(mStyle.style).to.not.be.equal(undefined);
  });

  it('pushes a function onto the Modernizr._q', function() {
    expect(Modernizr.ModernizrProto._q[0]).to.be.a('function');
  });

  it('deletes mStyle.style after the `_q` runs', function() {
    expect(mStyle.style).to.not.be.equal(undefined);
    Modernizr.ModernizrProto._q[0]();
    expect(mStyle.style).to.be.equal(undefined);
  });
});
