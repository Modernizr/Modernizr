describe('cssomPrefixes', function() {
  var setup = function(done, bool) {
    return (function() {
      define('ModernizrProto', [], function() {return {_config: {usePrefixes: bool}};});

      requirejs(['cssomPrefixes'], function(_cssomPrefixes) {
        cssomPrefixes = _cssomPrefixes;
        done();
      });
    })();
  };
  var teardown = function() {
    cssomPrefixes = undefined;
    requirejs.undef('cssomPrefixes');
    requirejs.undef('ModernizrProto');
  };
  var cssomPrefixes;
  var cleanup;


  before(function(done) {
    define('package', [], function() {return {version: 'v9999'};});

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['cleanup'], function(_cleanup) {
      cleanup = _cleanup;
      done();
    });
  });

  describe('prefixes enabled', function() {
    before(function(done) {
      setup(done, true);
    });

    after(teardown);

    it('returns prefixes', function(done) {
      requirejs(['cssomPrefixes'], function(cssomPrefixes) {
        expect(cssomPrefixes).to.not.have.length(0);
        done();
      });
    });
  });

  describe('prefixes disabled', function() {
    before(function(done) {
      setup(done, false);
    });

    after(teardown);

    it('returns no prefixes', function(done) {
      requirejs(['cssomPrefixes'], function(cssomPrefixes) {
        expect(cssomPrefixes).to.have.length(0);
        done();
      });
    });
  });

  after(function() {
    cleanup();
  });
});
