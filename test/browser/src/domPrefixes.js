describe('domPrefixes', function() {
  /*
    eslint no-unused-vars: ["error", {
      "varsIgnorePattern": "domPrefixes"
    }]
  */
  var domPrefixes;
  var domPrefixesAll;
  var cleanup;
  var req;

  var setup = function(done, bool) {
    return (function() {
      define('ModernizrProto', [], function() {return {_config: {usePrefixes: bool}};});

      req(['domPrefixes', 'domPrefixesAll'], function(_domPrefixes, _domPrefixesAll) {
        domPrefixes = _domPrefixes;
        domPrefixesAll = _domPrefixesAll;
        done();
      });
    })();
  };

  var teardown = function() {
    domPrefixes = undefined;
    domPrefixesAll = undefined;
    req.undef('domPrefixes');
    req.undef('domPrefixesAll');
    req.undef('ModernizrProto');
  };

  before(function(done) {
    define('package', [], function() {return {version: 'v9999'};});

    req = requirejs.config({
      context: Math.random().toString().slice(2),
      baseUrl: '../src',
      paths: {cleanup: '../test/cleanup'}
    });

    req(['cleanup'], function(_cleanup) {
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
      req(['domPrefixes'], function(domPrefixes) {
        expect(domPrefixes).to.not.have.length(0);
        done();
      });
    });

    it('returns one less then domPrefixesAll', function(done) {
      req(['domPrefixes', 'domPrefixesAll'], function(domPrefixes, domPrefixesAll) {
        expect(domPrefixes).to.have.length(domPrefixesAll.length-1);
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
      req(['domPrefixes'], function(domPrefixes) {
        expect(domPrefixes).to.have.length(0);
        done();
      });
    });
  });

  after(function() {
    cleanup();
  });
});
