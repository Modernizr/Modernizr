describe('getBody', function() {
  var getBody;
  var cleanup;

  before(function(done) {

    var req = requirejs.config({
      context: Math.random().toString().slice(2),
      baseUrl: '../src',
      paths: {cleanup: '../test/cleanup'}
    });

    req(['getBody', 'cleanup'], function(_getBody, _cleanup) {
      getBody = _getBody;
      cleanup = _cleanup;
      done();
    });
  });

  it('returns document.body', function() {
    var body = getBody();
    expect(body).to.be.equal(document.body);
    expect(body.fake).to.be.equal(undefined);
  });

  it('returns a fake when document.body does not exist', function() {
    var originalBody = document.body;
    var parentNode = originalBody.parentNode;
    parentNode.removeChild(originalBody);
    var body = getBody();
    parentNode.appendChild(originalBody);

    expect(body).to.not.equal(document.body);
    expect(body.fake).to.be.equal(true);
  });

  after(function() {
    cleanup();
  });
});
