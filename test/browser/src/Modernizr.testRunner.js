describe('Modernizr.testRunner', function() {
  /*
    eslint no-unused-vars: ["error", {
      "varsIgnorePattern": "tests"
    }]
  */
  var _Modernizr = makeIIFE({file: "./src/Modernizr.js", func: '_Modernizr'})
  var tests = [
    {
      'name': 'fakeFn',
      'fn': function() {return true;}
    }, {
      'name': 'fakeBool',
      'fn': false
    }, {
      'name': 'newFakeDetect',
      'fn': function() {return 10;},
      'options': {
        'aliases': ['fakeDetect']
      }
    }, {
      'name': 'fake',
      'fn': true
    }, {
      'name': 'fake.detect',
      'fn': 99
    }, {
      'name': 'fakeBoolDeep',
      'fn': new Boolean(true)
    }, {
      'name': 'fakeBoolDeep.detect',
      'fn': false
    }, {
      'fn': function() {
        return !!'async test';
      }
    }
  ];
  // since it is an internal dependency, we can't override an import with `external`
  // like normal, so even uglier hack we replace the string we eval, so the
  // lookups reference our local decleration above
  _Modernizr = _Modernizr.replace(/var tests\s*?=/, 'var testz =')
  eval(_Modernizr)
  var Modernizr = _Modernizr.default

  before(function() {
    _Modernizr.testRunner()
  })

  it('returns true if fn returns true', function() {
    expect('fakefn' in Modernizr).to.be.equal(true);
  });

  it('returns true if fn is a bool', function() {
    expect(Modernizr.fakebool).to.be.equal(false);
  });

  it('assigns aliased values', function() {
    expect(Modernizr.newfakedetect).to.be.equal(Modernizr.fakedetect);
  });

  it('deep assignments are valid', function() {
    expect(Modernizr.fake.detect).to.be.equal(99);
  });

  it('deep assignments are true with bool base', function() {
    expect(Modernizr.fakebooldeep instanceof Boolean).to.be.equal(true);
    expect(Modernizr.fakebooldeep.detect).to.be.equal(false);
  });
});
