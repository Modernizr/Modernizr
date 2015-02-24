describe('testProp', function() {
  var ModernizrProto = {};
  var testProp;
  var testProps;
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
    testProps = sinon.spy();

    define('testProps', function() {return testProps;});

    requirejs(['testProp'], function(_testProp) {
      testProp = _testProp;
      done();
    });
  });

  it('is a curried version of `testProps`', function() {
    testProp('flexAlign', 'end', true);
    expect(testProps.calledOnce).to.be(true);

    expect(testProps.calledWithExactly(
      ['flexAlign'],
      undefined,
      'end',
      true
    )).to.be(true);
  });

  it('is added to ModernizrProto', function() {
    expect(testProp).to.equal(ModernizrProto.testProp);
  });

  after(function() {
    cleanup();
  });
});
