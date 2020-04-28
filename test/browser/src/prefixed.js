describe('prefixed', function() {
  var prefixed;

  var testPropsAll = sinon.spy(function() {return 'fakeRule';});
  var cssToDOM = sinon.spy(function() {return 'fakeRule';});
  var atRule = sinon.spy(function() {return '@fakeRule';});
  // we are mocking out the module interface, not the Modernizr api
  var Modernizr = {ModernizrProto: {_config: {}, _q: []}}

  eval(makeIIFE({
    file: "./src/prefixed.js",
    func: 'prefixed',
    external: ['./Modernizr.js', './cssToDOM.js', './atRule.js', './testPropsAll.js']
  }))

  it('is a function', function() {
    expect(prefixed).to.be.a('function');
  });

  it('creates a reference on `ModernizrProto`', function() {
    expect(prefixed).to.be.equal(Modernizr.ModernizrProto.prefixed);
  });

  it('uses atRule to lookup rules starting with "@"', function() {
    expect(prefixed('@fakeRule')).to.be.equal('@fakeRule');
    expect(atRule.calledOnce).to.be.equal(true);
  });

  it('uses cssToDOM to lookup rules with "-"', function() {
    prefixed('fake-rule')
    expect(cssToDOM.calledOnce).to.be.equal(true);
    expect(testPropsAll.calledOnce).to.be.equal(true);
  });

  it('looks up properties on an element, when one is provided', function() {
    var elm = document.createElement('div');
    expect(prefixed('children', elm)).to.be.equal('fakeRule');
    expect(testPropsAll.calledOnce).to.be.equal(true);
  });

  afterEach(function() {
    testPropsAll.resetHistory();
    cssToDOM.resetHistory();
    atRule.resetHistory();
  });
});
