describe('ModernizrProto', function() {
  var _Modernizr = makeIIFE({file: "./src/Modernizr.js", func: 'Modernizr'})
  var tests;
  // since it is an internal dependcy, we can't override an import with `external`
  // like normal, so even uglier hack we replace the string we eval, so the
  // lookups reference our local decleration above
  _Modernizr = _Modernizr.replace(/var tests\s*?=/, 'var testz =')
  eval(_Modernizr)
  // ModernizrProto is a named export from Modernizr, we have to manually map it in
  // the IIFE build used in our tests
  var ModernizrProto = Modernizr.ModernizrProto

  beforeEach(function() {
    tests = []
  })


  it('should define a version', function() {
    expect(ModernizrProto._version).to.be.a('string');
  });

  it('should set a default config', function() {
    var config = ModernizrProto._config;

    expect(config.classPrefix).to.be.a('string');
    expect(config.enableClasses).to.be.a('boolean');
    expect(config.enableJSClass).to.be.a('boolean');
    expect(config.usePrefixes).to.be.a('boolean');
  });

  it('should define `Modernizr.addTest` and have it pushed to the internal `tests` queue', function() {
    var name = 'fakeDetect';
    var fn = function fakeCallback() {};
    var options = {opt: 'opt'};

    ModernizrProto.addTest(name, fn, options);
    expect(tests).to.have.length(1);
    expect(tests[0].name).to.be.equal(name);
    expect(tests[0].fn).to.be.equal(fn);
    expect(tests[0].options).to.be.equal(options);
  });

  it('should define `Modernizr.addAsyncTest` and have it pushed to the internal `tests` queue', function() {
    var fn = function fakeCallback() {};

    ModernizrProto.addAsyncTest(fn);
    expect(tests).to.have.length(1);
    expect(tests[0].fn).to.be.equal(fn);
  });

});
