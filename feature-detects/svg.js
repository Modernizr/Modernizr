define(['Modernizr'], function( Modernizr ) {
  // Thanks to Erik Dahlstrom
  Modernizr.addTest('svg', !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);
});
