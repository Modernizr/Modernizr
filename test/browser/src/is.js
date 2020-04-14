describe('is', function() {
  var is;

  eval(makeIIFE({file: "./src/is.js", func: 'is'}))

  it('is a function', function() {
    expect(is).to.be.a('function');
  });

  it('recognizes all types', function() {
    var _undefined = is(undefined, 'undefined');
    var _func = is(function() {}, 'function');
    var _bool = is(true, 'boolean');
    var _null = is(null, 'object');
    var _str = is('1', 'string');

    expect(_undefined).to.be.equal(true);
    expect(_func).to.be.equal(true);
    expect(_bool).to.be.equal(true);
    expect(_null).to.be.equal(true);
    expect(_str).to.be.equal(true);
  });
});
