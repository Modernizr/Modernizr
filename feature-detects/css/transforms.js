/*!
{
  "name": "CSS Transforms",
  "property": "csstransforms",
  "caniuse": "transforms2d",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('csstransforms', testAllProps('transform', 'scale(1)', true));
});
