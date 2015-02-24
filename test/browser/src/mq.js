describe('mq', function() {
  var ModernizrProto = {};
  var testMediaQuery;
  var cleanup;
  var mq;

  before(function(done) {

    define('ModernizrProto', [], function(){return ModernizrProto;});

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['mq', 'testMediaQuery', 'cleanup'], function(_mq, _testMediaQuery, _cleanup) {
      testMediaQuery = _testMediaQuery;
      mq = _mq;
      cleanup = _cleanup;
      done();
    });
  });

  it('is just an alias to `testMediaQuery`', function() {
    expect(mq).to.equal(testMediaQuery);
  });

  it('creates a reference on `ModernizrProto`', function() {
    expect(mq).to.equal(ModernizrProto.mq);
  });

  after(function() {
    cleanup();
  });
});
