/*!
{
  "name": "CSS position: fixed",
  "property": "csspositionfixed",
  "tags": ["css"],
  "async": true,
  authors: "Alex Grande",
  notes: "Inspired from https://github.com/kangax/cft/blob/gh-pages/feature_tests.js#L159-187"
}
!*/
define(['Modernizr', 'createElement', 'addTest'], function( Modernizr, createElement, addTest ) {
  Modernizr.addAsyncTest(function(){
    var elementTop,
      originalHeight,
      el = createElement('div'),
      PIXELS_TO_MOVE = 100,
      testName = 'csspositionfixed',
      body,
      timer = 0,
      maxAttempts = 20,
      attemptCount = 0;

    load();

    function load() {
      if (!document || !document.body) {
        attemptCount++;
        if (attemptCount === maxAttempts) {
          return clearTimeout(timer);
        }
        
        timer = setTimeout(load, 50);
      
      } else {
        clearTimeout(timer);
        body = document.body;
        test();
      }
    }

    function test() {
      if ( !( "getBoundingClientRect" in body ) ) {
        addTest( testName, false );
      }

      el.innerHTML = ' ';

      /* CSS classes to ensure the element is visible and it doesn't have css transforms.
      Transforms can conflict with position fixed in some instances.
      Visibilty and block are to ensure override of critical styles already in the page. */
      el.style.cssText = 'position:fixed;top:'+PIXELS_TO_MOVE+'px;visibility:visible;display:block;-webkit-transform:none;-moz-transform:none;transform:none;';

      body.appendChild( el );

      originalHeight = body.style.height;

      body.style.height = '1000px';
      body.scrollTop = 500;

      elementTop = el.getBoundingClientRect().top;
      body.style.height = originalHeight;

      body.removeChild(el);
      body.scrollTop = 0;

      addTest( testName, elementTop === PIXELS_TO_MOVE );
    }
  });
});