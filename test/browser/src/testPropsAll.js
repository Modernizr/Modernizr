describe('testPropsAll', function() {
  var _testDOMProps;
  var _testProps;
  var testPropsAll;
  // we are mocking out the module interface, not the Modernizr api
  var Modernizr = {ModernizrProto: {_config: {}}};

  eval(makeIIFE({file: "./src/testDOMProps.js", func: '_testDOMProps'}))
  eval(makeIIFE({file: "./src/testProps.js", func: '_testProps'}))

  var testDOMProps = sinon.spy(_testDOMProps)
  var testProps = sinon.spy(_testProps)

  eval(makeIIFE({
    file: "./src/testPropsAll.js",
    func: 'testPropsAll',
    external: ['./testDOMProps.js', './testProps.js', './Modernizr.js']
  }));

  beforeEach(function() {
    testDOMProps.resetHistory();
    testProps.resetHistory();
  });

  it('`testProps` is called if `prefixed` is a string', function() {
    testPropsAll('display', 'pfx', undefined, 'block');
    expect(testProps.callCount).to.be.equal(1);
  });

  it('`testProps` is called if `prefixed` is undefined', function() {
    testPropsAll('display', undefined, undefined, 'block');
    expect(testProps.callCount).to.be.equal(1);
  });

  it('`testDOMProps` is called if `prefixed` is anything else', function() {
    testPropsAll('display', [], undefined, 'block');
    expect(testDOMProps.callCount).to.be.equal(1);
  });

  it('is added to ModernizrProto as `testAllProps`', function() {
    expect(testPropsAll).to.be.equal(Modernizr.ModernizrProto.testAllProps);
  });
});
