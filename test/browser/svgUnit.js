describe('svg context unit tests', function() {
    /*
    eslint no-unused-vars: ["error", {
      "varsIgnorePattern": "createElement|getBody|Modernizr|setClasses"
    }]
  */
  var getBody
  var object;
  var svgContext;

  if ('createelementns' in document) {
    var setup = function(settings) {
      Object.assign(svgContext, settings.setup);

      svgContext.eval(settings.stringified);

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
      setup({
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
        done();
      }
      catch (e) { done(e); }

    });

    it('uses the correct namespace when creating elements', function(done) {
      var createElement = makeIIFE({file: "./src/createElement.js", func: 'createElement'})
        try {
          setup({
            stringified: createElement,
            setup: {
              isSVG: true
            }
          });

          svgContext.test(function() {
            window._testElem = createElement('a');
          });

          expect(svgContext._testElem.namespaceURI).to.be.equal('http://www.w3.org/2000/svg');

          done();
        }
        catch (e) { done(e); }
    });

    it('uses a SVG element for when making a fake body', function(done) {
      var getBody = makeIIFE({file: "./src/getBody.js", func: 'getBody'})
      try {
        setup({
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

        done();
      }
      catch (e) { done(e); }
    });

    afterEach(function() {
      object.parentNode.removeChild(object);
    });
  }
});
