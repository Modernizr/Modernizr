describe('getBody', function() {
  var getBody;

  var _getBody = makeIIFE({file: "./src/getBody.js", func: 'getBody'})
  eval(_getBody)

  if ('createElementNS' in document) {
    var svgContext;
    var object;

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
      sinon
    });

    it('works inside of an SVG', function(done) {
      setup({
        stringified: _getBody,
        setup: {
          expect: expect
        }
      })

      try {
        svgContext.test(function() {
          var body = getBody();
          expect(body.nodeName).to.equal('svg')
        });

        done();
      }
      catch (e) { done(e); }

    });

    afterEach(function() {
      object.parentNode.removeChild(object);
    });
  }


  it('returns document.body', function() {
    var body = getBody();
    expect(body).to.be.equal(document.body);
    expect(body.fake).to.be.equal(undefined);
  });

  it('returns a fake when document.body does not exist', function() {
    var originalBody = document.body;
    var parentNode = originalBody.parentNode;
    parentNode.removeChild(originalBody);
    var body = getBody();
    parentNode.appendChild(originalBody);

    expect(body).to.not.equal(document.body);
    expect(body.fake).to.be.equal(true);
  });
});
