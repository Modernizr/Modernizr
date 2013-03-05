/*!
{
  "name": "CSS Reflections",
  "caniuse": "",X
  "property": "cssreflections",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('cssreflections', testAllProps('boxReflect'));
});
