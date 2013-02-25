/*!
{
  "name": "Border Radius",
  "property": "borderradius",
  "caniuse": "border-radius",,
  "polyfills": ["css3pie"],
  "aliases": [],
  "tags": ["css"],
  "knownBugs": [],
  "doc" : null,
  "authors": [],
  "warnings": [],
  "notes": [{
    "name": "Comprehensive Compat Chart",
    "href": "http://muddledramblings.com/table-of-css3-border-radius-compliance"
  }]
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('borderradius', testAllProps('borderRadius'));
});
