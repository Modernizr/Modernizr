define(['Modernizr'], function( Modernizr ) {
  // tests if page is iframed
  // github.com/Modernizr/Modernizr/issues/242

  Modernizr.addTest('framed', window.location != top.location);
});
