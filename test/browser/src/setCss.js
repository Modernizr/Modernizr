describe('setCss', function() {
  var cleanup;
  var setCss;
  var elm;

  before(function(done) {
    elm = document.createElement('div');
    define('mStyle', [], function() {return elm;});

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['setCss', 'cleanup'], function(_setCss, _cleanup) {
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
