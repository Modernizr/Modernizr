describe('prefixes', function() {
  var setup = function(done, bool) {
    return (function() {
      define('ModernizrProto', [], function() {return {_config: {usePrefixes: bool}};});

      requirejs(['prefixes'], function(_prefixes) {
        prefixes = _prefixes;
        done();
      });
    })();
  };
  var teardown = function() {
    prefixes = undefined;
    requirejs.undef('prefixes');
    requirejs.undef('ModernizrProto');
  };
  var prefixes;
  var cleanup;


  before(function(done) {
    define('package', [], function() {return {};});

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
      requirejs(['prefixes'], function(prefixes) {
        expect(prefixes).to.be.an('array');
        expect(prefixes).to.not.have.length(0);
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
      requirejs(['prefixes'], function(prefixes) {
        expect(prefixes).to.be.an('array');
        expect(prefixes).to.have.length(0);
        done();
      });
    });
  });

  after(function() {
    cleanup();
  });
});
