describe('testXhrType', function() {
  var cleanup;
  var req;

  before(function(done) {

    req = requirejs.config({
      context: Math.random().toString().slice(2),
      baseUrl: '../src',
      paths: {
        cleanup: '../test/cleanup'
      }
    });

    req(['cleanup'], function(_cleanup) {
      cleanup = _cleanup;
      done();
    });
  });

  it('returns false when XHR is undefined', function(done) {
    var originalXhr = XMLHttpRequest;
    XMLHttpRequest = undefined;

    req(['testXhrType'], function(testXhrType) {
      expect(testXhrType('json')).to.be.equal(false);
      XMLHttpRequest = originalXhr;
      done();
    });
  });

  // TODO:: add more tests once sinon's XHR2 features land
  // http://git.io/AemZ

  afterEach(function() {
    req.undef('testXhrType');
  });

  after(function() {
    cleanup();
  });
});
