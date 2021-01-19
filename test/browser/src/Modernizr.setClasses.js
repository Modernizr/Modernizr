describe('Modernizr.setClasses', function() {
  /*
    eslint no-unused-vars: ["error", {
      "varsIgnorePattern": "setClasses|isSVG"
    }]
  */
  var setClasses;
  var _Modernizr

  var setup = function(config, defaultClassName) {
    return (function() {

      var docElement = document.createElement('div');
      if (defaultClassName) {
        docElement.className = defaultClassName;
      }

      eval(makeIIFE({file: "./src/Modernizr.js", func: '_Modernizr', external: ['./docElement.js']}))

      _Modernizr.default._config = config

      return {setClasses: _Modernizr.setClasses, elm: docElement}
    })();
  };


  describe('cssClasses disabled', function() {
    var obj  = setup({
      'classPrefix': 'fake',
      'enableClasses': false
    });
    var setClasses = obj.setClasses
    var docElement = obj.elm

    it('should not add anything', function() {
      setClasses(['detect']);
      expect(docElement.className).to.not.contain('fakedetect');
    })
  });

  describe('cssClasses enabled, with prefix', function() {
    var obj = setup({
      'classPrefix': 'fake',
      'enableClasses': true
    });
    var setClasses = obj.setClasses
    var docElement = obj.elm

    it('adds a class with a prefix', function() {
      setClasses(['detect']);
      expect(docElement.className).to.contain('fakedetect');
    });
  });

  describe('cssClasses enabled, without prefix', function() {
    var obj = setup({
      'enableClasses': true
    });
    var setClasses = obj.setClasses
    var docElement = obj.elm

    it('adds a class without a prefix', function() {
      setClasses(['detect']);
      expect(docElement.className).to.contain('detect');
    });
  });

  describe('cssClasses disabled', function() {
    var obj = setup({
      'enableClasses': false
    });
    var setClasses = obj.setClasses
    var docElement = obj.elm

    it('adds a class without a prefix', function() {
      setClasses(['detect']);
      expect(docElement.className).to.not.contain('detect');
    });
  });

  describe('enableJSClass enabled, with prefix', function() {
    var obj = setup({
      'classPrefix': 'fake',
      'enableClasses': true,
      'enableJSClass': true
    }, ' fakeno-js +fakeno-js fakeno-js- i-has-fakeno-js');
    var setClasses = obj.setClasses
    var docElement = obj.elm

    it('changes the `js` class, and adds a class with a prefix', function() {
      var classNames = docElement.className.split(' ');
      expect(classNames).to.contain('fakeno-js');
      setClasses(['detect']);

      classNames = docElement.className.split(' ');
      expect(docElement.className).to.contain('fakejs');
      expect(docElement.className).to.contain('+fakeno-js');
      expect(docElement.className).to.contain('fakeno-js-');
      expect(docElement.className).to.contain('i-has-fakeno-js');
      expect(docElement.className).to.contain('fakedetect');
    });
  });

  describe('enableJSClass enabled, without prefix', function() {
    var obj = setup({
      'enableJSClass': true,
      'enableClasses': true
    }, ' no-js +no-js no-js- i-has-no-js');
    var setClasses = obj.setClasses
    var docElement = obj.elm

    it('changes the `js` class, and adds a class without a prefix', function() {
      var classNames = docElement.className.split(' ');
      expect(classNames).to.contain('no-js');
      setClasses(['detect']);

      classNames = docElement.className.split(' ');
      expect(docElement.className).to.contain('js');
      expect(docElement.className).to.contain('+no-js');
      expect(docElement.className).to.contain('no-js-');
      expect(docElement.className).to.contain('i-has-no-js');
      expect(docElement.className).to.contain('detect');
    });
  });

  describe('enableJSClass disabled', function() {
    var obj = setup({
      'enableJSClass': false
    });
    var setClasses = obj.setClasses
    var docElement = obj.elm

    it('should not add a js class', function() {
      setClasses(['detect']);
      expect(docElement.className).to.equal('');
    });
  });

  describe('only adds the classPrefix when there are detect classes to add', function() {
    var obj = setup({
      'enableClasses': true,
      'classPrefix': 'FAIL'
    }, 'classPrefixTest');

    var setClasses = obj.setClasses
    var docElement = obj.elm

    it('should not add a js class', function() {
      expect(docElement.className).to.equal('classPrefixTest');
      setClasses([]);
      expect(docElement.className).to.equal('classPrefixTest');
    });
  });

  describe('SVG', function() {
    var docElement = {className: {}}

    var isSVG = true

    eval(makeIIFE({file: "./src/Modernizr.js", func: '_Modernizr', external: ['./docElement.js', './isSVG.js']}))

    var setClasses = _Modernizr.setClasses

    _Modernizr.default._config = {
      'enableJSClass': false,
      'enableClasses': true
    }

    it('adds a className inside an API', function() {
      setClasses(['detect']);
      expect(docElement.className).to.be.an('object')
      expect(docElement.className.baseVal).to.exist.and.contain('detect')
    });
  });
});
