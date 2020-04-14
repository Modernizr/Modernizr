describe('cssToDOM', function() {
  var cssToDOM;

  eval(makeIIFE({file: "./src/cssToDOM.js", func: 'cssToDOM'}))

  it('converts kebab to camel', function() {
    expect(cssToDOM('fake-detect')).to.be.equal('fakeDetect');
  });
});
