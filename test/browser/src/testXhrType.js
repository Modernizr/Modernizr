describe('testXhrType', function() {
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: {
        cleanup: '../test/cleanup'
      }
    });

    requirejs(['cleanup'], function(_cleanup) {
      cleanup = _cleanup;
      done();
    });
  });

  /*jshint -W020 */
  it('returns false when XHR is undefined', function(done) {
    var originalXhr = XMLHttpRequest;
    XMLHttpRequest = undefined;

    requirejs(['testXhrType'], function(testXhrType) {
      expect(testXhrType('json')).to.equal(false);
      XMLHttpRequest = originalXhr;
      done();
    });
  });
  /*jshint +W020 */

  // TODO add more tests once sinon's XHR2 features land
  // http://git.io/AemZ

  afterEach(function() {
    requirejs.undef('testXhrType');
  });

  after(function() {
    cleanup();
  });
});
