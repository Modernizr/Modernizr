/*!
{
  "name": "Border Image",
  "property": "borderimage",
  "aliases": [],
  "tags": ["css"],
  "knownBugs": [],
  "doc" : null,
  "authors": [],
  "warnings": [],
  "notes": []
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('borderimage', testAllProps('borderImage'));
});
