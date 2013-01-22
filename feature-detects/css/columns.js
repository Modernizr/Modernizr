define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('csscolumns', testAllProps('columnCount'));
});
