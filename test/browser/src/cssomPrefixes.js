describe('cssomPrefixes', function() {
  /*
    eslint no-unused-vars: ["error", {
      "varsIgnorePattern": "Modernizr"
    }]
  */
  var cssomPrefixes;

  var setup = function(bool) {
    var Modernizr = {ModernizrProto: {_config: {usePrefixes: bool}}}
    eval(makeIIFE({file: "./src/cssomPrefixes.js", func: 'cssomPrefixes', external: ['./Modernizr.js']}))
    return cssomPrefixes
  };

    it('returns prefixes, when enabled', function() {
      var cssomPrefixes = setup(true);
      expect(cssomPrefixes).to.not.have.length(0);
    });

  it('returns no prefixes, when prefixed disabled', function() {
    var cssomPrefixes = setup(false);
    expect(cssomPrefixes).to.have.length(0);
  });
});
