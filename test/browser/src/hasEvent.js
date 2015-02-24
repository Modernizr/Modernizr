describe('hasEvent', function() {
  var ModernizrProto = {};
  var isEventSupported;
  var hasEvent;
  var cleanup;

  before(function(done) {

    define('ModernizrProto', [], function(){return ModernizrProto;});

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['hasEvent', 'isEventSupported', 'cleanup'], function(_hasEvent, _isEventSupported, _cleanup) {
      isEventSupported = _isEventSupported;
      hasEvent = _hasEvent;
      cleanup = _cleanup;
      done();
    });
  });

  it('is just an alias to `isEventSupported`', function() {
    expect(hasEvent).to.equal(isEventSupported);
  });

  it('is added to ModernizrProto', function() {
    expect(hasEvent).to.equal(ModernizrProto.hasEvent);
  });

  after(function() {
    cleanup();
  });
});
