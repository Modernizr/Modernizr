define(['Modernizr'], function( Modernizr ) {
  // cors
  // By Theodoor van Donge
  Modernizr.addTest('cors', !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()));
});
