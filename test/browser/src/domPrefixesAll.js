describe('domPrefixesAll', function() {
  var domPrefixesAll;
  var domPrefixes;

  eval(makeIIFE({file: "./src/domPrefixesAll.js", func: 'domPrefixesAll'}))

  it('is an array', function() {
    expect(domPrefixesAll).to.be.an('array');
  });

  it('is domPrefixes, and an empty string', function() {
    eval(makeIIFE({file: "./src/domPrefixes.js", func: 'domPrefixes'}))

    expect(domPrefixesAll).to.have.members(domPrefixes.concat(['']));
  });
});
