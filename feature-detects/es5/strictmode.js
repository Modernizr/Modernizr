define(['Modernizr'], function( Modernizr ) {
  // strict mode
  // test by @kangax
  Modernizr.addTest('strictmode', (function(){ "use strict"; return !this; })());
});
