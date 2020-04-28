describe('testDOMProps', function() {
  eval(makeIIFE({file: "./src/testDOMProps.js", func: 'testDOMProps'}))
  var elm = document.createElement('div');
  var testDOMProps;

  it('returns known values', function() {
    expect(testDOMProps(['clientHeight'], elm)).to.be.equal(elm.clientHeight);
  });

  it('returns false for unknown values', function() {
    expect(testDOMProps(['fart'], elm)).to.be.equal(false);
  });

  it('bind a value to to the object', function() {
    elm.answer = function() {return 42;};
    expect(testDOMProps(['answer'], elm)()).to.be.equal(elm.answer());
  });

  it('bind a value to the element, if it is provided', function() {
    elm.answer = function() {return 42;};
    expect(testDOMProps(['answer'], {}, elm)).to.be.equal(false);
  });

  it('return the property name as a string if elem is false', function() {
    elm.answer = function() {return 42;};
    expect(testDOMProps(['answer'], {'answer': 42}, false)).to.be.equal('answer');
  });
});
