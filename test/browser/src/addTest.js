describe('addTest', function() {
  var ModernizrProto;
  var setClasses;
  var Modernizr;
  var addTest;
  var cleanup;
  var sinon;
  var req;

  before(function(done) {

    req = requirejs.config({
      context: Math.random().toString().slice(2),
      baseUrl: '../src',
      paths: {
        sinon: '../node_modules/sinon/pkg/sinon',
        cleanup: '../test/cleanup'
      }
    });

    req(['cleanup', 'sinon'], function(_cleanup, _sinon) {
      cleanup = _cleanup;
      sinon = _sinon;
      done();
    });

  });

  beforeEach(function(done) {

    ModernizrProto = {};
    Modernizr = {_q: [], _config:  {}};
    setClasses = sinon.spy();

    define('ModernizrProto', [], function() {return ModernizrProto;});
    define('Modernizr', [], function() {return Modernizr;});
    define('setClasses', [], function() {return setClasses;});
    define('package', [], function() {return {};});

    req(['addTest'], function(_addTest) {
      addTest = _addTest;
      done();
    });
  });

  afterEach(function() {
    req.undef('ModernizrProto');
    req.undef('setClasses');
    req.undef('Modernizr');
    req.undef('package');
    req.undef('addTest');
  });

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

    it('should define Modernizr.addTest at the end of the _q', function() {
      Modernizr._q[0]();
      expect(ModernizrProto.addTest).to.be.equal(addTest);
    });
  });

  describe('Modernizr.on', function() {
    var fakeDetect = function() {};

    it('keeps track of requests', function() {
      ModernizrProto.on('fakeDetect', fakeDetect);
      expect(ModernizrProto._l.fakeDetect).to.be.an('array');
      expect(ModernizrProto._l.fakeDetect[0]).to.be.equal(fakeDetect);
    });

    it('does not recreate the queue with duplicate requests', function() {
      ModernizrProto.on('fakeDetect', fakeDetect);
      ModernizrProto.on('fakeDetect', fakeDetect);
      expect(ModernizrProto._l.fakeDetect.length).to.be.equal(2);
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
      expect(function() {ModernizrProto._trigger('fakeDetect');}).to.not.throw();
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
      Modernizr._trigger = sinon.spy();
      expect(Modernizr.fakedetect).to.be.equal(undefined);
      expect(Modernizr.fake).to.be.equal(undefined);
      expect(Modernizr.detect).to.be.equal(undefined);
    });

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

    it('sets a true class for a true value', function() {
      addTest('fakedetect', function() {return 100;});
      expect(setClasses.callCount).to.be.equal(1);
      expect(setClasses.calledWith(['fakedetect'])).to.be.equal(true);
    });

    it('sets a truthy class for a truthy value', function() {
      addTest('fakedetect', function() {return 100;});
      expect(setClasses.callCount).to.be.equal(1);
      expect(setClasses.calledWith(['fakedetect'])).to.be.equal(true);
    });

    it('sets a negative class for a false value', function() {
      addTest('fakedetect', function() {return false;});
      expect(setClasses.callCount).to.be.equal(1);
      expect(setClasses.calledWith(['no-fakedetect'])).to.be.equal(true);
    });

    it('sets a negative class for a falsy value', function() {
      addTest('fakedetect', function() {return undefined;});
      expect(setClasses.callCount).to.be.equal(1);
      expect(setClasses.calledWith(['no-fakedetect'])).to.be.equal(true);
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
      expect(setClasses.callCount).to.be.equal(2);
      expect(setClasses.calledWith(['fake'])).to.be.equal(true);
      expect(setClasses.calledWith(['no-detect'])).to.be.equal(true);
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
      expect(setClasses.callCount).to.be.equal(1);
    });

    it('returns an instance of Modernizr for chaining', function() {
      expect(addTest('fakeDetect', true)).to.be.equal(Modernizr);
    });
  });

  after(function() {
    cleanup();
  });
});
