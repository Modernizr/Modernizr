describe('domPrefixes', function() {
  /*
    eslint no-unused-vars: ["error", {
      "varsIgnorePattern": "Modernizr"
    }]
  */
  var domPrefixesAll;
  var domPrefixes;

  var setup = function(bool) {
    var Modernizr = {ModernizrProto: {_config: {usePrefixes: bool}}}
    eval(makeIIFE({file: "./src/domPrefixes.js", func: 'domPrefixes', external: ['./Modernizr.js']}))
    return domPrefixes
  };

    it('returns prefixes, when enabled', function() {
      var domPrefixes = setup(true);
      expect(domPrefixes).to.not.have.length(0);
    });

  it('is the same as domPrefixesAll, but without a empty string', function() {
    var domPrefixes = setup(true);
    eval(makeIIFE({file: "./src/domPrefixesAll.js", func: 'domPrefixesAll'}))
    expect(domPrefixes).to.have.length(domPrefixesAll.length - 1);
  });

  it('returns no prefixes, when prefixed disabled', function() {
    var domPrefixes = setup(false);
    expect(domPrefixes).to.have.length(0);
  });
});
