define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  // border-image
  Modernizr.addTest('borderimage', testAllProps('borderImage'));
});
