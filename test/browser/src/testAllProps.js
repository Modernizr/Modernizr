describe('testAllProps', function() {
  var ModernizrProto = {};
  var testAllProps;
  var testPropsAll;
  var cleanup;
  var sinon;

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: {
        sinon: '../test/js/lib/sinon',
        cleanup: '../test/cleanup'
      }
    });

    define('ModernizrProto', [], function(){return ModernizrProto;});
    define('package', [], function() {return {};});

    requirejs(['cleanup', 'sinon'], function(_cleanup, _sinon) {
      cleanup = _cleanup;
      sinon = _sinon;
      done();
    });
  });

  beforeEach(function(done) {
    testPropsAll = sinon.spy();

    define('testPropsAll', function() {return testPropsAll;});

    requirejs(['testAllProps'], function(_testAllProps) {
      testAllProps = _testAllProps;
      done();
    });
  });

  it('is a curried version of `testPropsAll`', function() {
    testAllProps('flexAlign', 'end', true);
    expect(testPropsAll.calledOnce).to.be(true);

    expect(testPropsAll.calledWithExactly(
      'flexAlign',
      undefined,
      undefined,
      'end',
      true
    )).to.be(true);
  });

  it('is added to ModernizrProto', function() {
    expect(testAllProps).to.equal(ModernizrProto.testAllProps);
  });

  after(function() {
    cleanup();
  });
});
