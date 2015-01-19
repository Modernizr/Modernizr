/*!
{
  "name": "Box Shadow",
  "property": "boxshadow",
  "caniuse": "css-boxshadow",
  "tags": ["css"],
  "knownBugs": [
    "WebOS false positives on this test.",
    "The Kindle Silk browser false positives"
  ]
}
!*/
/* DOC
Detects support for the box-shadow CSS property.
*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('boxshadow', testAllProps('boxShadow', '1px 1px', true));
});
