describe('fnBind', function() {
  var fnBind;

  eval(makeIIFE({file: "./src/fnBind.js", func: 'fnBind'}))

  it('binds to `this`', function() {
    var foo = {x: 1};
    var bar = function() {
      return this.x;
    };

    expect(fnBind(bar, foo)()).to.be.equal(1);
  });
});
