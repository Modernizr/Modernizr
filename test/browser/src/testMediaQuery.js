describe('testMediaQuery', function() {
  var injectElementWithStyles;
  var testMediaQuery;
  var cleanup;
  var sinon;
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

      docElem.insertBefore( fakeBody, refNode );
      bool = div.offsetWidth === 42;
      docElem.removeChild( fakeBody );

      return {
        matches: bool,
        media: q
      };
    };
  })();

  before(function(done) {

    requirejs.config({
      baseUrl: '../src',
      paths: {
        sinon: '../test/js/lib/sinon',
        cleanup: '../test/cleanup'
      }
    });

    requirejs(['injectElementWithStyles', 'cleanup', 'sinon'], function(_injectElementWithStyles, _cleanup, _sinon) {
      injectElementWithStyles = _injectElementWithStyles;
      cleanup = _cleanup;
      sinon = _sinon;
      done();
    });

  });

  if (window.matchMedia || window.msMatchMedia) {
    describe('matchMedia version', function() {
      before(function(done) {
        requirejs(['testMediaQuery'], function(_testMediaQuery) {
          testMediaQuery = _testMediaQuery;
          done();
        });
      });

      it('works', function() {
        expect(testMediaQuery('only screen')).to.equal(media('only screen').matches);
        expect(testMediaQuery('only fake rule')).to.equal(media('only fake rule').matches);
      });
    });
  } else  {
    describe('fallback version', function() {

      before(function(done) {
        injectElementWithStyles = sinon.spy(injectElementWithStyles);
        requirejs.undef('injectElementWithStyles');
        requirejs.undef('testMediaQuery');

        define('injectElementWithStyles', [], function() {return injectElementWithStyles;});

        requirejs(['testMediaQuery'], function(_testMediaQuery) {
          testMediaQuery = _testMediaQuery;
          done();
        });
      });

      it('works', function() {

        expect(testMediaQuery('only screen')).to.equal(media('only screen').matches);
        expect(testMediaQuery('only fake rule')).to.equal(media('only fake rule').matches);
        expect(injectElementWithStyles.called).to.be(true);
      });

    });

  }

  afterEach(function() {
    requirejs.undef('testMediaQuery');
  });

  after(function() {
    cleanup();
  });
});
