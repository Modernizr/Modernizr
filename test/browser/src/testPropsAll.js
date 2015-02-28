describe('testPropsAll', function() {
  var ModernizrProto = {_config: {}};
  var Modernizr = {_q: []};
  var testPropsAll;
  var testDOMProps;
  var testProps;
  var cleanup;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: {
        sinon: '../test/js/lib/sinon',
        cleanup: '../test/cleanup'
      }
    });

    define('ModernizrProto', [], function(){return ModernizrProto;});
    define('Modernizr', [], function(){return Modernizr;});
    define('package', [], function() {return {};});

    requirejs(['testDOMProps', 'testProps', 'cleanup', 'sinon'], function(_testDOMProps, _testProps, _cleanup, _sinon) {
        testDOMProps = _sinon.spy(_testDOMProps);
        testProps = _sinon.spy(_testProps);
        cleanup = _cleanup;

        done();
      });

  });

  beforeEach(function(done) {
    requirejs.undef('testDOMProps');
    requirejs.undef('testProps');

    testDOMProps.reset();
    testProps.reset();

    define('testDOMProps', function() {return testDOMProps;});
    define('testProps', function() {return testProps;});

    requirejs(['testPropsAll'], function(_testPropsAll) {
      testPropsAll = _testPropsAll;

      expect(testDOMProps.callCount).to.be(0);
      expect(testProps.callCount).to.be(0);
      done();
    });

  });

  it('`testProps` is called if `prefixed` is a string', function() {
    testPropsAll('display', 'pfx', undefined, 'block');
    expect(testProps.callCount).to.be(1);
  });

  it('`testProps` is called if `prefixed` is undefined', function() {
    testPropsAll('display', undefined, undefined, 'block');
    expect(testProps.callCount).to.be(1);
  });

  it('`testDOMProps` is called if `prefixed` is anything else', function() {
    testPropsAll('display', [], undefined, 'block');
    expect(testDOMProps.callCount).to.be(1);
  });

  it('is added to ModernizrProto as `testAllProps`', function() {
    expect(testPropsAll).to.equal(ModernizrProto.testAllProps);
  });

  afterEach(function() {
    requirejs.undef('testPropsAll');
    requirejs.undef('testDOMProps');
    requirejs.undef('testProps');
  });

  after(function() {
    cleanup();
  });
});
