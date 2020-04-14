describe('isSVG', function() {
  var svgContext;
  var object;
  var isSVG;

  if (typeof self === "undefined") {
    // node land
    var expect = require('chai').expect;
    var projectRoot = require('find-parent-dir').sync(__dirname, 'package.json');
    isSVG = require(`${projectRoot}/src/isSVG`).default

    it('is accurate', function() {
      expect(isSVG).to.be.false
    })
  } else {
    // eslint-disable-next-line no-redeclare
    var expect = window.expect
    // browser land
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

    it('is accurate', function(done) {
      var _isSVG = makeIIFE({file: "./src/isSVG.js", func: 'isSVG'})
      eval(_isSVG)

      var testInstance = setup({
        stringified: _isSVG,
        setup: {
          expect: expect,
        }
      });

      try {
        svgContext.test(function() {
          expect(isSVG).to.be.true
        });

        // this runs in the browser thread, so it should be false
        expect(isSVG).to.be.false

        testInstance.cleanup();
        done();
      }
      catch (e) { done(e); }

    });

    afterEach(function() {
      object.parentNode.removeChild(object);
    });
  }
}
})
