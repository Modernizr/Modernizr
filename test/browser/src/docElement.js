describe('docElement', function() {
  var docElement;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['docElement', 'cleanup'], function(_docElement, _cleanup) {
      docElement = _docElement;
      cleanup = _cleanup;
      done();
    });
  });

  it('is an alias to document.documentElement', function() {
    expect(docElement).to.equal(document.documentElement);
  });

  it('is valid and correct', function() {
    expect(docElement).to.equal(document.getElementsByTagName('html')[0]);
  });

  after(function() {
    cleanup();
  });
});
