/* eslint-disable no-restricted-syntax */
describe('testProps', function() {
  var testProps;

  describe('native detect', function() {
    var nativeTestProps = sinon.stub().callsFake(function(props, value) { if (!!value) return true });
    var contains = sinon.spy();
    eval(makeIIFE({file: "./src/testProps.js", func: 'testProps', external: ['./nativeTestProps.js','./contains.js'] }))

    beforeEach(function() {
      nativeTestProps.resetHistory()
    });

    it('returns the value from nativeTestProp if not undefined', function() {
      testProps(['fake'], undefined, true)
      expect(nativeTestProps.callCount).to.equal(1);
      expect(contains.callCount).to.equal(0);
    });

    it('does not return the value from nativeTestProp when undefined', function() {
      expect(testProps(['fake'], undefined, false));
      expect(nativeTestProps.callCount).to.equal(1);
      expect(contains.callCount).to.not.equal(0);
    });
  });

  describe('nonnative detect', function() {
    var contains = sinon.stub().callsFake(function(a, b) {return a.indexOf(b) > -1});
    var nativeTestProps = sinon.stub().callsFake(function() { return });
    var cssToDOM = sinon.spy();
    var mStyle = {};
    eval(makeIIFE({
      file: "./src/testProps.js",
      func: 'testProps',
      external: ['./nativeTestProps.js','./contains.js', './cssToDOM.js', './mStyle.js']
    }))

    beforeEach(function() {
      nativeTestProps.resetHistory()
      contains.resetHistory()
      cssToDOM.resetHistory()
    });

    it('cleans up mStyle changes', function() {
      expect(testProps(['fake'], undefined, true));
      expect(contains.callCount).to.equal(1);
      expect(mStyle.style).to.equal(undefined);
      expect(mStyle.modElem).to.equal(undefined);
    });

    it('calls cssToDOM when props have a `-`', function() {
      expect(testProps(['fake-detect'], undefined, true));
      expect(cssToDOM.called).to.equal(true);
    });

    it('returns true for valid prop, and skipValueTest', function() {
      expect(testProps(['display'], undefined, true, true)).to.equal(true);
    });

    it('returns true for valid prop, and good value', function() {
      expect(testProps(['display'], undefined, 'block')).to.equal(true);
    });

    it('returns false for valid prop and bad value', function() {
      expect(testProps(['display'], undefined, 'penguin')).to.equal(false);
    });

    it('returns the prop if a prefixed lookup with skipValueTest', function() {
      expect(testProps(['display'], 'pfx', 'block', true)).to.equal('display');
    });

    it('works properly', function() {
      // Everyone supports margin
      expect(testProps(['margin'])).to.equal(true);
      // Nobody supports the happiness style. :(
      expect(testProps(['happiness'])).to.equal(false);
      // Everyone supports fontSize
      expect(testProps(['fontSize'])).to.equal(true);
      // kebab-case should work too
    });

    it('returns the prop if a prefixed lookup', function() {
      expect(testProps(['display'], 'pfx', 'block')).to.equal('display');
    });
  });
});
