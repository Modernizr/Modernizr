describe('mq', function() {
  var mq;

  var media = window.matchMedia || (function() {
    // adapted from jQuery Mobile
    // http://git.io/NFWo

    var bool;
    var docElem = document.documentElement;
    var refNode = docElem.firstElementChild || docElem.firstChild;
    // fakeBody required for <FF4 when executed in <head>
    var fakeBody = document.createElement('body');
    var div = document.createElement('div');

    div.id = 'mq-test-1';
    div.style.cssText = 'position:absolute;top:-100em';
    fakeBody.style.background = 'none';
    fakeBody.appendChild(div);

    return function(q) {

      div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width: 42px; }</style>';

      docElem.insertBefore(fakeBody, refNode);
      bool = div.offsetWidth === 42;
      docElem.removeChild(fakeBody);

      return {
        matches: bool,
        media: q
      };
    };
  })();


  if (window.matchMedia || window.msMatchMedia) {
    describe('matchMedia version', function() {
      eval(makeIIFE({file: "./src/mq.js", func: 'mq'}))

      it('works', function() {
        expect(mq('only screen')).to.be.equal(media('only screen').matches);
        expect(mq('only fake rule')).to.be.equal(media('only fake rule').matches);
      });
    });
  }

  describe('fallback version', function() {
    var matchMedia = self.matchMedia
    var msMatchMedia = self.msMatchMedia;

    before(function() {
      delete self.matchMedia
      delete self.msMatchMedia
    })

    it('works', function() {
      var _injectElementWithStyles;
      var injectElementWithStyles

      eval(makeIIFE({file: "./src/injectElementWithStyles.js", func: '_injectElementWithStyles'}))

      injectElementWithStyles = sinon.spy(_injectElementWithStyles)

      eval(makeIIFE({file: "./src/mq.js", func: 'mq', external: ['./injectElementWithStyles.js']}))

      expect(mq('only screen')).to.be.equal(media('only screen').matches);
      expect(mq('only fake rule')).to.be.equal(media('only fake rule').matches);
      expect(injectElementWithStyles.called).to.be.equal(true);
    });

    it('works even without getComputedStyle', function() {
      /*
      eslint no-unused-vars: ["error", {
        "varsIgnorePattern": "_globalThis|injectElementWithStyles"
      }]
      */
      var _globalThis = {}
      var injectElementWithStyles = function(mediaQuery, callback) {
        callback({currentStyle: {position: 'absolute'}})
      }

      eval(makeIIFE({file: "./src/mq.js", func: 'mq', external: ['./injectElementWithStyles.js', './globalThis.js']}))

      expect(mq('only screen')).to.be.equal(media('only screen').matches);
    });

    after(function() {
      self.matchMedia = matchMedia
      self.msMatchMedia = msMatchMedia
    })
  });

});
