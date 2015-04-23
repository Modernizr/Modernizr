describe('setCss', function() {
  var cleanup;
  var setCss;
  var elm;

  before(function(done) {
    elm = document.createElement('div');
    define('mStyle', [], function() {return elm;});

    var req = requirejs.config({
      context: Math.random().toString().slice(2),
      baseUrl: '../src',
      paths: {cleanup: '../test/cleanup'}
    });

    req(['setCss', 'cleanup'], function(_setCss, _cleanup) {
      setCss = _setCss;
      cleanup = _cleanup;
      done();
    });
  });

  it('sets css text of modElem', function() {
    expect(elm.style.cssText).to.be('');
    setCss('color: red');
    expect(elm.style.cssText.toLowerCase()).to.contain('color: red');
  });

  after(function() {
    cleanup();
  });
});
