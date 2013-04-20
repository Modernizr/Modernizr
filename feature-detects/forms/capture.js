// http://www.w3.org/TR/html-media-capture/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // testing for capture attribute in inputs
  Modernizr.addTest('capture', ('capture' in createElement('input')));
});
