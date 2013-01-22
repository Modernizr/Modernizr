define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  // The *old* flexbox
  // www.w3.org/TR/2009/WD-css3-flexbox-20090723/
  Modernizr.addTest('flexboxlegacy', testAllProps('boxDirection'));
});
