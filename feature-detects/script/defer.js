define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // defer script
  // By Theodoor van Donge
  Modernizr.addTest('scriptdefer', 'defer' in createElement('script'));
});
