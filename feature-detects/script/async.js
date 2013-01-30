define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // async script
  // By Theodoor van Donge
  Modernizr.addTest('scriptasync', 'async' in createElement('script'));
});
