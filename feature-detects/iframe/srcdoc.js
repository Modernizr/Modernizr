define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // Test for `srcdoc` attribute in iframes.
  //
  // Spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/the-iframe-element.html#attr-iframe-srcdoc

  Modernizr.addTest('srcdoc', 'srcdoc' in createElement('iframe'));
});
