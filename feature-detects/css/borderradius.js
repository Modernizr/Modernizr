define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  // Super comprehensive table about all the unique implementations of
  // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance
  Modernizr.addTest('borderradius', testAllProps('borderRadius'));
});
