describe('domPrefixes', function() {
  var setup = function(done, bool) {
    return (function() {
      define('ModernizrProto', [], function() {return {_config: {usePrefixes: bool}};});

      requirejs(['domPrefixes'], function(_domPrefixes) {
        domPrefixes = _domPrefixes;
        done();
      });
    })();
  };

  var teardown = function() {
    domPrefixes = undefined;
    requirejs.undef('domPrefixes');
    requirejs.undef('ModernizrProto');
  };
  var domPrefixes;
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
      requirejs(['domPrefixes'], function(domPrefixes) {
        expect(domPrefixes).to.not.have.length(0);
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
      requirejs(['domPrefixes'], function(domPrefixes) {
        expect(domPrefixes).to.have.length(0);
        done();
      });
    });
  });

  after(function() {
    cleanup();
  });
});
