describe('Modernizr', function() {
  eval(makeIIFE({file: "./src/Modernizr.js", func: 'Modernizr'}))
  // Since Modernizr has multiple exports, we need to explictly request
  // the `default` export inside of an IIFE build
  var Modernizr = Modernizr.default

  it('should be an object', function() {
    expect(Modernizr).to.be.an('object');
  })

});
