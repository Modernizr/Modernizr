define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  // developer.mozilla.org/en/CSS/box-sizing
  // github.com/Modernizr/Modernizr/issues/248
  Modernizr.addTest('boxsizing', function() {
    return testAllProps('boxSizing') && (document.documentMode === undefined || document.documentMode > 7);
  });
});
