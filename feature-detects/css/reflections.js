define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('cssreflections', testAllProps('boxReflect'));
});
