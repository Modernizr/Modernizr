define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  // The *new* flexbox
  // dev.w3.org/csswg/css3-flexbox
  Modernizr.addTest('flexbox', testAllProps('flexWrap'));
});
