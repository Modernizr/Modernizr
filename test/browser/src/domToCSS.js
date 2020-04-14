describe('domToCSS', function() {
  var domToCSS;

  eval(makeIIFE({file: "./src/domToCSS.js", func: 'domToCSS'}))

  it('converts kebab to camel', function() {
    expect(domToCSS('fakeDetect')).to.be.equal('fake-detect');
  });
});
