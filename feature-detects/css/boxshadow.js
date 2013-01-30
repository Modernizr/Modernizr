define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  // WebOS unfortunately false positives on this test.
  Modernizr.addTest('boxshadow', testAllProps('boxShadow'));
});
