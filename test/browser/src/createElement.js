describe('createElement', function() {
  var createElement;
  var svgContext;
  var object;

  var _createElement = makeIIFE({file: "./src/createElement.js", func: 'createElement'});
  eval(_createElement)

  if ('createElementNS' in document) {
    var spy
    var setup = function(settings) {
      var stringified = settings.stringified;
      var instrumented = !!stringified.match(/var cov_/);

      Object.assign(svgContext, settings.setup);

      svgContext.eval(stringified);

      settings.cleanup = function() {
        if (instrumented) {
          var coverageObjName = stringified.match(/var path='([^']*createElement.js)'/)[1]
          Object.assign(window.__coverage__[coverageObjName].s, svgContext.__coverage__[coverageObjName].s);
          Object.assign(window.__coverage__[coverageObjName].b, svgContext.__coverage__[coverageObjName].b);
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

    it('works inside of an SVG', function(done) {
      var testInstance = setup({
        stringified: _createElement,
        setup: {
          expect: expect,
          sinon: sinon
        }
      })

      try {
        svgContext.test(function() {
          var svgElementName = "SVG_CREATE_ELEMENT_TEST"
          spy = sinon.spy(document, 'createElementNS')
          var svgElement = createElement(svgElementName)
          expect(spy.calledWith('http://www.w3.org/2000/svg', 'SVG_CREATE_ELEMENT_TEST')).to.equal(true)
          expect(svgElement.nodeName).to.equal(svgElementName)
          spy.restore()
        });

        testInstance.cleanup();
        done();
      }
      catch (e) { done(e); }

    });

    afterEach(function() {
      object.parentNode.removeChild(object);
    });
  }

  it('is a function', function() {
    expect(createElement).to.be.a('function');
  });

  it('creates an element', function() {
    var element = createElement('modernizr');
    expect(element.nodeName.toUpperCase()).to.be.equal('MODERNIZR');
  });

  it('works around IE7 createElement bug', function() {
    var stub2 = sinon.stub()
    var stub;
    try {
      stub = sinon.stub(document, 'createElement')
      // see createElement comments for background.
      // we need to return 'object' for a typeof check
      // and then be a function. yay ie!
      stub.get(function() {
        stub.get(function() {return stub2})
        return 'object'
      })

      createElement('FAKE_ELEM')
      expect(stub2.calledWith('FAKE_ELEM')).to.be('true')
      stub.restore()
    } catch (e) { stub.restore() }
  })


});
