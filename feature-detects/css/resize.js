define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  // Test for CSS 3 UI "resize" property
  // http://www.w3.org/TR/css3-ui/#resize
  // https://developer.mozilla.org/en/CSS/resize

  Modernizr.addTest('cssresize', testAllProps('resize'));
});
