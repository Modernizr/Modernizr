/*!
{
  "name": "CSS position:fixed",
  "property": "cssfixed",
  "caniuse": "css-fixed",
  "tags": ["css"],
  "notes": [{
    "name": "Common feature tests: IS_POSITION_FIXED_SUPPORTED",
    "href": "http://kangax.github.io/cft/#IS_POSITION_FIXED_SUPPORTED"
  },{
    "name": "How to Determine Positions of Elements",
    "href": "https://groups.google.com/forum/?fromgroups#!topic/comp.lang.javascript/zWJaFM5gMIQ"
  },{
    "name": "Support for getClientRects and getBoundingClientRect",
    "href": "https://bugzilla.mozilla.org/show_bug.cgi?id=174397"
 }]
}
!*/
define(['Modernizr', 'injectElementWithStyles', 'getBody'], function( Modernizr, injectElementWithStyles, getBody ) {
  // migrated from kangax's solution
  // swaydeng fixed 2px extra offset bug in IE<=7
  // http://kangax.github.io/cft/#IS_POSITION_FIXED_SUPPORTED
  Modernizr.addTest('cssfixed', function() {
      var isSupported = false;

      injectElementWithStyles('#modernizr { position:fixed; top:2px; }', function ( node ) {

          if ( !node.getBoundingClientRect ) {
              return;
          }

          var body = getBody();
          var bodyHeight = body.style.height;
          var bodyScrollTop = body.scrollTop;
          // In IE<=7, the window's upper-left is at 2,2 (pixels) with respect to the true client.
          // https://groups.google.com/forum/?fromgroups#!topic/comp.lang.javascript/zWJaFM5gMIQ
          // https://bugzilla.mozilla.org/show_bug.cgi?id=174397
          var extraTop  = body.getBoundingClientRect().top;

          body.style.height = '3000px';
          body.scrollTop = 1;

          body.style.height = bodyHeight;
          body.scrollTop = bodyScrollTop;

          isSupported = (node.getBoundingClientRect().top - extraTop) === 2;
      });

      return isSupported;
  });

});