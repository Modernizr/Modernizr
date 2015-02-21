describe('mStyle', function() {
  var Modernizr;
  var mStyle;
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

    requirejs(['mStyle', 'cleanup'], function(_mStyle, _cleanup) {
      mStyle = _mStyle;
      cleanup = _cleanup;
      done();
    });
  });

  it('returns an object with a style prop', function() {
    expect(mStyle).to.be.an('object');
    expect(mStyle.style).to.not.be(undefined);
  });

  it('pushes a function onto the Modernizr._q', function() {
    expect(Modernizr._q[0]).to.be.a('function');
  });

  it('deletes mStyle.style after the `_q` runs', function() {
    expect(mStyle.style).to.not.be(undefined);
    Modernizr._q[0]();
    expect(mStyle.style).to.be(undefined);
  });

  afterEach(function() {
    requirejs.undef('Modernizr');
    requirejs.undef('mStyle');
  });

  after(function() {
    cleanup();
  });
});
