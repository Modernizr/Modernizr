describe('toStringFn', function() {
  var toStringFn;

  eval(makeIIFE({file: "./src/toStringFn.js", func: 'toStringFn'}))

  it('is an function', function() {
    expect(toStringFn).to.be.an('function');
  });

  it('toStrings stuff', function() {
    expect(toStringFn.call([])).to.be.equal('[object Array]');
    expect(toStringFn.call({})).to.be.equal('[object Object]');
    expect(toStringFn.call(true)).to.be.equal('[object Boolean]');
    expect(toStringFn.call(new Date())).to.be.equal('[object Date]');
  });

});
