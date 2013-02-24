/*!
{
  "name": "Box Shadow",
  "property": "boxshadow",
  "caniuse": "css-boxshadow",
  "aliases": [],
  "tags": ["css"],
  "knownBugs": ["WebOS false positives on this test."],
  "doc" : null,
  "authors": [],
  "warnings": [],
  "notes": []
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('boxshadow', testAllProps('boxShadow'));
});
