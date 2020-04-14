describe('prefixedCSSValue', function() {
  var prefixedCSSValue;

  eval(makeIIFE({file: "./src/prefixedCSSValue.js", func: 'prefixedCSSValue'}))

  it('returns the value when it is valid', function() {
    expect(prefixedCSSValue('display', 'block')).to.be.equal('block');
  });

  it('returns false when the prop is not supported', function() {
    expect(prefixedCSSValue('fart', 'block')).to.be.equal(false);
  });

  it('returns false when value is not supported', function() {
    expect(prefixedCSSValue('display', 'fart')).to.be.equal(false);
  });
});
