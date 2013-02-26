/*!
{
  "name": "Border Image",
  "property": "borderimage",
  "caniuse": "border-image",
  "polyfills": ["css3pie"],
  "tags": ["css"]
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('borderimage', testAllProps('borderImage'));
});
