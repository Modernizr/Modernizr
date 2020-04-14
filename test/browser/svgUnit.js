describe('svg context unit tests', function() {
    /*
    eslint no-unused-vars: ["error", {
      "varsIgnorePattern": "createElement|getBody|Modernizr|setClasses"
    }]
  */
  var createElement
  var getBody
  var object;
  var svgContext;

  if ('createElementNS' in document) {
    var setup = function(settings) {
      var stringified = settings.stringified;
      var instrumented = !!stringified.match(/__cov_/);

      if (instrumented) {
        settings.coverageObjName = stringified.match(/(?:^[^{]*{)([^.]*)/)[1];
        svgContext[settings.coverageObjName] = window[settings.coverageObjName];
      }

      Object.assign(svgContext, settings.setup);

      svgContext.eval(stringified);

      settings.cleanup = function() {
        if (instrumented) {
          window[settings.coverageObjName] = svgContext[settings.coverageObjName] ;
        }
      };

      return settings;
    };

    beforeEach(function(done) {
      object = document.createElement('object');

      object.data = '../test/img/unit.svg';
      object.type = 'image/svg+xml';
      object.id = 'svgContext';

      object.onerror = function() {
        var arg = Array.prototype.slice.call(arguments).join(' ');
        try {
          expect(arg).to.be.equal(undefined);
        } catch (e) {
          done(e);
        }
      };

      object.runUnitTests = function(thisRef) {
        svgContext = thisRef;
        done();
      };

      document.body.appendChild(object);
    });

    it('is still able to set classNames correctly', function(done) {
      var _Modernizr;

      _Modernizr = makeIIFE({file: "./src/Modernizr.js", func: '_Modernizr'})
      var Modernizr = _Modernizr.default;
      var setClasses = _Modernizr.setClasses;
      var testInstance = setup({
        stringified: _Modernizr,
        setup: {
          docElement: svgContext.document.documentElement,
          isSVG: true
        }
      });

      try {
        svgContext.test(function() {
          var Modernizr = _Modernizr.default;
          var setClasses = _Modernizr.setClasses;
          Modernizr._config = {enableClasses: true}
          setClasses(['svgdetect']);
        });

        expect(svgContext.document.documentElement.className.baseVal).to.contain('svgdetect');
        testInstance.cleanup();
        done();
      }
      catch (e) { done(e); }

    });

    it('uses the correct namespace when creating elements', function(done) {
      var createElement = makeIIFE({file: "./src/createElement.js", func: 'createElement'})
        try {
          var testInstance = setup({
            stringified: createElement,
            setup: {
              isSVG: true
            }
          });

          svgContext.test(function() {
            window._testElem = createElement('a');
          });

          expect(svgContext._testElem.namespaceURI).to.be.equal('http://www.w3.org/2000/svg');

          testInstance.cleanup();

          done();
        }
        catch (e) { done(e); }
    });

    it('uses a SVG element for when making a fake body', function(done) {
      var getBody = makeIIFE({file: "./src/getBody.js", func: 'getBody'})
      try {
        var testInstance = setup({
          stringified: getBody.toString(),
          setup: {
            isSVG: true,
            createElement: function() {
              return svgContext.document.createElement.apply(svgContext.document, arguments);
            }
          }
        });

        svgContext.test(function() {
          window._body = getBody();
        });

        expect(svgContext._body.nodeName.toLowerCase()).to.be.equal('svg');

        testInstance.cleanup();

        done();
      }
      catch (e) { done(e); }
    });

    afterEach(function() {
      object.parentNode.removeChild(object);
    });
  }
});
