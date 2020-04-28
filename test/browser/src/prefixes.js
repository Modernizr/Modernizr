describe('prefixes', function() {
  /*
    eslint no-unused-vars: ["error", {
      "varsIgnorePattern": "Modernizr"
    }]
  */
  var prefixes;

  var setup = function(bool) {
    var Modernizr = {ModernizrProto: {_config: {usePrefixes: bool}}}
    eval(makeIIFE({file: "./src/prefixes.js", func: 'prefixes', external: ['./Modernizr.js']}))
    return prefixes
  };

  it('returns prefixes when enabled', function() {
    var prefixes = setup(true);
    expect(prefixes).to.be.an('array');
    expect(prefixes.length).to.be.above(2);
  });

  it('returns no prefixes', function() {
    var prefixes = setup(false);
    expect(prefixes).to.be.an('array');
    expect(prefixes).to.have.length(2);
    expect(prefixes[0]).to.equal('');
    expect(prefixes[1]).to.equal('');
  });
});
