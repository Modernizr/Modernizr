describe('contains', function() {
  var contains;

  eval(makeIIFE({file: "./src/contains.js", func: 'contains'}))

  it('finds substrings', function() {
    expect(contains('fakeDetect', 'akeDet')).to.be.equal(true);
  });
});
