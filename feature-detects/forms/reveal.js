/*!
{
  "name": "CSS ::reveal pseudo-selector",
  "caniuse": "css-sel3",
  "property": "reveal",
  "tags": ["css"],
  "notes": [{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/pull/879"
  }]
}
!*/
define(['Modernizr', 'selectorSupported'], function( Modernizr, selectorSupported ) {
  // testing for reveal feature in input fields of type password
  Modernizr.addTest('reveal', selectorSupported('::reveal'));
});