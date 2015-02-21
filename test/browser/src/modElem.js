describe('modElem', function() {
  var Modernizr;
  var modElem;
  var cleanup;

  before(function() {

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

  });

  beforeEach(function(done) {
    Modernizr = {_q: []};
    define('Modernizr', [], function() {return Modernizr;});

    requirejs.config({
      baseUrl: '../src',
      paths: { cleanup: '../test/cleanup' }
    });

    requirejs(['modElem', 'cleanup'], function(_modElem, _cleanup) {
      modElem = _modElem;
      cleanup = _cleanup;
      done();
    });
  });

  it('returns an object with an `elem` prop', function() {
    expect(modElem).to.be.an('object');
    expect(modElem.elem).to.not.be(undefined);
    expect(modElem.elem.nodeName.toUpperCase()).to.be('MODERNIZR');
  });

  it('pushes a function onto the Modernizr._q', function() {
    expect(Modernizr._q[0]).to.be.a('function');
  });

  it('deletes modElem.style after the `_q` runs', function() {
    expect(modElem.elem).to.not.be(undefined);
    Modernizr._q[0]();
    expect(modElem.elem).to.be(undefined);
  });

  afterEach(function() {
    requirejs.undef('Modernizr');
    requirejs.undef('modElem');
  });

  after(function() {
    cleanup();
  });
});
