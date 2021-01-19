describe('testStyles', function() {
  var testStyles;

  eval(makeIIFE({file: "./src/testStyles.js", func: 'testStyles'}))

  it('creates a reference on `ModernizrProto`', function() {
    expect(testStyles).to.be.a('function');
  });

  it('is just an alias to injectElementWithStyles', function() {
    expect(testStyles.name).to.be.equal('injectElementWithStyles');
  });

});
