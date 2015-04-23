describe('hasEvent', function() {
  var ModernizrProto = {};
  var isEventSupported;
  var hasEvent;
  var cleanup;

  before(function(done) {

    define('ModernizrProto', [], function() {return ModernizrProto;});

    var req = requirejs.config({
      context: Math.random().toString().slice(2),
      baseUrl: '../src',
      paths: {cleanup: '../test/cleanup'}
    });

    req(['hasEvent', 'isEventSupported', 'cleanup'], function(_hasEvent, _isEventSupported, _cleanup) {
      isEventSupported = _isEventSupported;
      hasEvent = _hasEvent;
      cleanup = _cleanup;
      done();
    });
  });

  it('is just an alias to `isEventSupported`', function() {
    expect(hasEvent).to.equal(isEventSupported);
  });

  if (ModernizrProto.hasEvent === hasEvent) {
  it('is added to ModernizrProto', function() {
    expect(hasEvent).to.equal(ModernizrProto.hasEvent);
  });
  } else {
    it('is added to ModernizrProto', function() {
      expect(hasEvent).to.equal(ModernizrProto);
    });
  }

  after(function() {
    cleanup();
  });
});
