describe('toStringFn', function() {
  var toStringFn;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['toStringFn', 'cleanup'], function(_toStringFn, _cleanup) {
      toStringFn = _toStringFn;
      cleanup = _cleanup;
      done();
    });
  });


  it('is an function', function() {
    expect(toStringFn).to.be.an('function');
  });

  it('toStrings stuff', function() {
    expect(toStringFn.call([])).to.equal('[object Array]');
    expect(toStringFn.call({})).to.equal('[object Object]');
    expect(toStringFn.call(true)).to.equal('[object Boolean]');
    expect(toStringFn.call(new Date())).to.equal('[object Date]');
  });

  after(function() {
    cleanup();
  });
});
