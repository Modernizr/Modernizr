define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // FF3.0 will false positive on this test
  Modernizr.addTest('textshadow', createElement('div').style.textShadow === '');
});
