describe('classes', function() {
  var _classes = makeIIFE({file: "./src/classes.js", func: 'classes'})
  var classes;
  eval(_classes)

  it('is an array', function() {
    expect(classes).to.be.an('array');
    expect(classes.length).to.equal(0);
  });
});
