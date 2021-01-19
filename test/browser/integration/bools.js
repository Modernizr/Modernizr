describe('bools', function() {
  it('all properties are lower case', function() {
    Object.keys(Modernizr).every(function(result, name) {
      return expect(name).to.not.match(/[A-Z]/);
    });
  });

  describe('everythings ship shape', function() {
    Object.keys(Modernizr)
      .filter(m => m && Modernizr.hasOwnProperty(m))
      .sort()
      .forEach(function(name) {
        var result = Modernizr[name];
        if (name === 'input' || name === 'inputtypes') {
          return;
        }

        it(name + ' is a boolean value or Boolean object', function() {
          expect(
            result instanceof Boolean ||
            result === true ||
            result === false
          ).to.be.equal(true);
        });
      })
  });

});
