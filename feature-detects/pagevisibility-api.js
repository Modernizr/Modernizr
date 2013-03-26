define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // https://developer.mozilla.org/en-US/docs/DOM/Using_the_Page_Visibility_API
  // http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/PageVisibility/Overview.html

  Modernizr.addTest('pagevisibility', !!prefixed("hidden", document, false));
});
