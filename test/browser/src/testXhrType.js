describe('testXhrType', function() {
  var testXhrType;

  eval(makeIIFE({file: "./src/testXhrType.js", func: 'testXhrType'}))

  it('returns false when XHR is undefined', function() {
    var originalXhr = XMLHttpRequest;
    XMLHttpRequest = undefined; //eslint-disable-line

    expect(testXhrType('json')).to.be.equal(false);
    XMLHttpRequest = originalXhr; //eslint-disable-line
  });


  describe('', function() {
    before(function() {
      sinon.stub(XMLHttpRequest.prototype, 'open')
    })

    it('calls XHR correctly', function() {
      testXhrType('json')
      expect(XMLHttpRequest.prototype.open.called).to.be.true
      expect(XMLHttpRequest.prototype.open.calledWith('get', '/', true)).to.be.true
    })

    after(function() {
      XMLHttpRequest.prototype.open.restore()
    })
  })

  describe('', function() {
    var stub;
    before(function() {
      stub = sinon.stub(XMLHttpRequest.prototype, 'responseType')
      stub.set(function() {
        throw new Error('faked error')
      })
    })

    it('returns false when modifying the responseType throws an error', function() {
      expect(testXhrType('text')).to.be.false
    })

    after(function() {
      stub.restore()
    })
  })
  // TODO:: add more tests once sinon's XHR2 features land
  // http://git.io/AemZ
});
