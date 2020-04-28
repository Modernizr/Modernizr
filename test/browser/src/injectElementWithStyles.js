describe('injectElementWithStyles', function() {
  /*
    eslint no-unused-vars: ["error", {
      "varsIgnorePattern": "createElement|parentNode"
    }]
  */
  var injectElementWithStyles;
  var parentNode;

  eval(makeIIFE({file: "./src/injectElementWithStyles.js", func: 'injectElementWithStyles'}))

  it('is a function', function() {
    expect(injectElementWithStyles).to.be.a('function');
  });

  it('styles an injected element', function() {
    var callback = function() {
      var modernizr = document.getElementById('modernizr');
      return modernizr.clientWidth === 10;
    };

    var result = injectElementWithStyles('#modernizr{width: 10px}', callback);
    expect(result).to.be.equal(true);
  });

  it('passes back a rule matching what we gave it', function(done) {
    var style = '#modernizr{width: 10px}';
    var callback = function(elm, rule) {
      expect(rule).to.be.equal(style);
      done();
    };

    injectElementWithStyles(style, callback);
  });

  it('passes the #modernizr element in the callback', function(done) {
    var style = '#modernizr{width: 10px}';
    var callback = function(elm) {
      expect(elm.id).to.be.equal('modernizr');
      done();
    };

    injectElementWithStyles(style, callback);
  });

  it('deletes an element after the test', function() {
    expect(document.getElementById('modernizr')).to.be.equal(null);

    var callback = function() {
      expect(document.getElementById('modernizr')).to.not.be.equal(null);
    };

    injectElementWithStyles('', callback);

    expect(document.getElementById('modernizr')).to.be.equal(null);
  });

  it('creates multiple nodes when requested', function(done) {

    var callback = function(elm) {
      expect(elm.childNodes.length).to.be.equal(9);
      done();
    };

    injectElementWithStyles('', callback, 8);
  });

  it('names multiple nodes based on `testname` when configured', function(done) {

    var callback = function() {
      var test = document.getElementById('test');
      var element = document.getElementById('element');

      expect(test).to.not.be.equal(null);
      expect(element).to.not.be.equal(null);
      done();
    };

    injectElementWithStyles('', callback, 2, ['test', 'element']);
  });


  it('still works with the oldIE <style> API', function() {
    var mockedAPI = {}
    var create = document.createElement

    var createElement = function(arg) {
      if (arg === 'style') {
        var s = create.call(document, arg)
        s.styleSheet = mockedAPI
        return s
      } else {
        return create.call(document, arg)
      }
    }

    eval(makeIIFE({file: "./src/injectElementWithStyles.js", func: 'injectElementWithStyles', external: ['./createElement.js']}))
    var cssText = '#modernizr{width: 10px}'

    injectElementWithStyles(cssText, function() {});
    expect(mockedAPI.cssText).to.equal(cssText)
  })


  describe('', function() {
    var originalBody = document.body;
    var parentNode = originalBody.parentNode;
    eval(makeIIFE({file: "./src/injectElementWithStyles.js", func: 'injectElementWithStyles'}))

    it('copes with a fake body', function(done) {

      var callback = function() {
        var body = document.body;

        expect(body.fake).to.be.equal(true);

        // injectElementWithStyles overrides the background value for fake body to
        // an empty string, however old IE changes this to the following string.
        if (body.style.background !== 'none transparent scroll repeat 0% 0%') {
          expect(body.style.background.length).to.be.equal(0);
        }

        expect(body.style.overflow).to.be.equal('hidden');
        done();
      };

      expect(document.body.fake).to.not.be.equal(true);
      parentNode.removeChild(originalBody);
      injectElementWithStyles('', callback);
    });

    after(function() {
      if (!$.contains(parentNode, originalBody)) {
        parentNode.appendChild(originalBody);
      }
      expect(document.body.fake).to.not.be.equal(true);
    });
  })
});
