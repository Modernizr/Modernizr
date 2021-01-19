describe('omPrefixes', function() {
  var omPrefixes;

  eval(makeIIFE({file: "./src/omPrefixes.js", func: 'omPrefixes'}))

  it('returns a string', function() {
    expect(omPrefixes).to.be.a('string');
    expect(omPrefixes.length).to.not.be.equal(0);
  });
});
