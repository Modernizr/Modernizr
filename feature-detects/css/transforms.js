/*!
{
  "name": "CSS Transforms",
  "property": "csstransforms",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('csstransforms', !!testAllProps('transform'));
});
