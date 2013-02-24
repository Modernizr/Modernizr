define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('cssgridlayout', testAllProps('gridRowAlign'));
});
