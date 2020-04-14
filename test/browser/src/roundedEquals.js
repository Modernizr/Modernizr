describe('roundedEquals', function() {
  var roundedEquals;

  eval(makeIIFE({file: "./src/roundedEquals.js", func: 'roundedEquals'}))

  it('works', function() {
    expect(roundedEquals(1, 2)).to.be.equal(true);
    expect(roundedEquals(2, 2)).to.be.equal(true);
    expect(roundedEquals(3, 2)).to.be.equal(true);
  });
});
