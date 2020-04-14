describe('Modernizr.addTest', function() {
  var _Modernizr
  eval(makeIIFE({file: "./src/Modernizr.js", func: '_Modernizr'}))
  // Since Modernizr has multiple exports, we need to explictly request
  // the `default` export inside of an IIFE build
  var addTest = _Modernizr.addTest
  var Modernizr = _Modernizr.default
  var ModernizrProto = _Modernizr.ModernizrProto


  describe('setup', function() {

    it('adds an object for test listeners', function() {
      expect(ModernizrProto._l).to.be.an('object');
    });

    it('should define the `ModernizrProto._trigger` function', function() {
      expect(ModernizrProto._trigger).to.be.an('function');
    });

    it('should push the Modernizr.addTest definition to the `_q`', function() {
      expect(Modernizr._q).to.have.length(1);
      expect(Modernizr._q[0]).to.be.a('function');
    });
  });

  describe('Modernizr.on', function() {
    var fakeDetect = function() {};

    it('keeps track of requests', function() {
      ModernizrProto.on('fakeDetect', fakeDetect);
      expect(ModernizrProto._l.fakeDetect).to.be.an('array');
      expect(ModernizrProto._l.fakeDetect[0]).to.be.equal(fakeDetect);
    });

    it('triggers results if the detect already ran', function(done) {
      Modernizr.fakeDetect = 'fake';
      Modernizr._trigger = sinon.spy();
      ModernizrProto.on('fakeDetect', fakeDetect);

      setTimeout(function() {
        expect(Modernizr._trigger.calledOnce).to.be.equal(true);
        expect(Modernizr._trigger.calledWith('fakeDetect', Modernizr.fakeDetect)).to.be.equal(true);
        done();
      }, 0);
    });

  });

  describe('Modernizr._trigger', function() {

    it('skips the callback if it does not exist', function() {
      expect(function() {ModernizrProto._trigger('thisDoesNotExist');}).to.not.throw();
    });

    it('runs the listener calledback if it does exist', function(done) {
      var spy = sinon.spy();

      ModernizrProto.on('fakeDetect', spy);
      ModernizrProto._trigger('fakeDetect', 'fakeRes');

      setTimeout(function() {
        expect(spy.calledOnce).to.be.equal(true);
        done();
      });
    });

    it('deletes the listener after it runs', function(done) {

      ModernizrProto.on('fakeDetect', function() {});

      expect(ModernizrProto._l.fakeDetect).to.be.an('array');

      ModernizrProto._trigger('fakeDetect', 'fakeRes');

      setTimeout(function() {
        expect(ModernizrProto._l.fakeDetect).to.be.equal(undefined);
        done();
      });
    });
  });

  describe('Modernizr.addTest', function() {

    beforeEach(function() {
      Modernizr._trigger = sinon.spy();
    })

    beforeEach(function() {
      expect(Modernizr.fakedetect).to.be.equal(undefined);
      expect(Modernizr.fake).to.be.equal(undefined);
      expect(Modernizr.detect).to.be.equal(undefined);
    });

    afterEach(function() {
      Modernizr.fakedetect = undefined
      Modernizr.fake = undefined
      Modernizr.detect = undefined
    })

    it('sets the proper bool on the Modernizr object with a function', function() {
      addTest('fakedetect', function() {return true;});
      expect(Modernizr.fakedetect).to.be.equal(true);
    });

    it('sets the proper bool on the Modernizr object with a bool', function() {
      addTest('fakedetect', false);
      expect(Modernizr.fakedetect).to.be.equal(false);
    });

    it('does not cast to a bool on the Modernizr object with a truthy value', function() {
      addTest('fakedetect', function() {return 100;});
      expect(Modernizr.fakedetect).to.be.equal(100);
    });

    it('does not cast to a bool on the Modernizr object with a falsy value', function() {
      addTest('fakedetect', function() {return undefined;});
      expect('fakedetect' in Modernizr).to.be.equal(true);
      expect(Modernizr.fakedetect).to.be.equal(undefined);
    });

    it('forces detect names are lowercase', function() {
      addTest('FaKeDeTeCt', true);
      expect(Modernizr.fakedetect).to.be.equal(true);
    });

    it('supports nested properties with a bool base', function() {
      addTest('fake', true);
      addTest('fake.detect', true);
      expect(typeof Modernizr.fake).to.be.equal('object'); // workaround for  https://github.com/chaijs/chai/issues/1174
      expect(Modernizr.fake.detect).to.be.equal(true);
    });

    it('supports nested properties', function() {
      addTest('fake', true);
      addTest('fake.detect', true);
      expect(typeof Modernizr.fake).to.be.equal('object'); // workaround for  https://github.com/chaijs/chai/issues/1174
      expect(Modernizr.fake.detect).to.be.equal(true);
    });

    it('does not overwrite values once they are set', function() {
      addTest('fakeDetect', false);
      expect(Modernizr.fakedetect).to.be.equal(false);
      expect(Modernizr._trigger.calledOnce).to.be.equal(true);

      addTest('fakeDetect', true);
      expect(Modernizr.fakedetect).to.be.equal(false);
      expect(Modernizr._trigger.calledOnce).to.be.equal(true);
    });

    it('allows feature to be an object of features', function() {
      addTest({fake: true, detect: false});
      expect(Modernizr.fake).to.be.equal(true);
      expect(Modernizr.detect).to.be.equal(false);
    });

    it('properly filters out monkey patched object properties', function() {
      var noop = function() {};
      Object.prototype.MOD_FAKE_VALUE = noop;
      var config = {detect: false};

      expect(config.MOD_FAKE_VALUE).to.be.equal(noop);
      addTest(config);

      delete Object.prototype.MOD_FAKE_VALUE;

      expect(Modernizr.MOD_FAKE_VALUE).to.be.equal(undefined);
      expect(Modernizr.mod_fake_value).to.be.equal(undefined);
      expect(Modernizr.detect).to.be.equal(false);
    });

    it('returns an instance of Modernizr for chaining', function() {
      expect(addTest('fakeDetect', true)).to.be.equal(Modernizr);
    });
  });

});
