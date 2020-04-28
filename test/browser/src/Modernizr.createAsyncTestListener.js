describe('Modernizr.createAsyncTestListener', function() {
  var _Modernizr;

  eval(makeIIFE({file: "./src/Modernizr.js", func: '_Modernizr'}))
  var createAsyncTestListener = _Modernizr.createAsyncTestListener
  var Modernizr = _Modernizr.default
  var runTests = _Modernizr.testRunner


  it('return a function', function() {
    expect(createAsyncTestListener()).to.be.a('function');
  });

  it('wires into Modernizr.on if given a function as aa callbcak argument', function(done) {
    var callback = sinon.spy()
    var listener = createAsyncTestListener('cATLTest')
    listener(callback)

    expect(callback.callCount).to.equal(0);

    Modernizr._trigger('cATLTest')

    // _trigger gets put on the next tick, so we needd to wait for it to have run
    setTimeout(function() {
      expect(callback.callCount).to.equal(1);
      done()
    },0)
  });

  if (typeof Promise !== 'undefined') {
    it('returns a Promise if no function is supplied', function() {
      var listener = createAsyncTestListener()

      expect(listener() instanceof Promise).to.equal(true)
    });

    it('resolves the promise', function(done) {
      var str = 'it works!'
      var listener = createAsyncTestListener('testasynctest')
      Modernizr.addTest('testasynctest', str)
      runTests()

      listener().then(function(result) {
        expect(result).to.equal(str)
        done()
      })

    });
  }
});
