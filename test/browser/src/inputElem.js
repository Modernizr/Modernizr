describe('inputElem', function() {
  var inputElem;

  eval(makeIIFE({file: "./src/inputElem.js", func: 'inputElem'}))

  it('returns an input element', function() {
    expect(inputElem.nodeName).to.be.equal('INPUT');
  });
});
