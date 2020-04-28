describe('testProp', function() {
  // we are mocking out the module interface, not the Modernizr api
  var Modernizr = {ModernizrProto: {_config: {}, _q: []}};
  var _testProps
  var testProp

  eval(makeIIFE({file: "./src/testProps.js", func: '_testProps', external: ['./Modernizr.js']}))

  var testProps = sinon.spy(_testProps)

  eval(makeIIFE({file: "./src/testProp.js", func: 'testProp', external: ['./Modernizr.js', './testProps.js']}))

  it('is a curried version of `testProps`', function() {
    testProp('flexAlign', 'end', true);
    expect(testProps.calledOnce).to.be.equal(true);

    expect(testProps.calledWithExactly(
      ['flexAlign'],
      undefined,
      'end',
      true
    )).to.be.equal(true);
  });

  it('is added to ModernizrProto', function() {
    expect(testProp).to.be.equal(Modernizr.ModernizrProto.testProp);
  });

});
