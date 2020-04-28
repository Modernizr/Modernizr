describe('testAllProps', function() {
  // we are mocking out the module interface, not the Modernizr api
  var Modernizr = {ModernizrProto: {_config: {}, _q: []}};
  var _testPropsAll;
  var testAllProps;

  eval(makeIIFE({file: "./src/testPropsAll.js", func: '_testPropsAll', external: ['./Modernizr.js']}))

  var testPropsAll = sinon.spy(_testPropsAll)

  eval(makeIIFE({file: "./src/testAllProps.js", func: 'testAllProps', external: ['./Modernizr.js', './testPropsAll.js']}))

  it('is a curried version of `testPropsAll`', function() {
    testAllProps('flexAlign', 'end', true);
    expect(testPropsAll.calledOnce).to.be.equal(true);

    expect(testPropsAll.calledWithExactly(
      'flexAlign',
      undefined,
      undefined,
      'end',
      true
    )).to.be.equal(true);
  });

  it('is added to ModernizrProto', function() {
    expect(testAllProps).to.be.equal(Modernizr.ModernizrProto.testAllProps);
  });

});
