describe('docElement', function() {
  var docElement;

  eval(makeIIFE({file: "./src/docElement.js", func: 'docElement'}))

  it('is an alias to document.documentElement', function() {
    expect(docElement).to.be.equal(document.documentElement);
  });

  it('is valid and correct', function() {
    expect(docElement).to.be.equal(document.getElementsByTagName('html')[0]);
  });
});
