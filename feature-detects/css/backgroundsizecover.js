/*!
{
  "name": "Background Size Cover",
  "property": "bgsizecover",
  "tags": ["css"],
  "builderAliases": ["css_backgroundsizecover"],
  "notes": [{
    "name" : "MDN Docs",
    "href": "http://developer.mozilla.org/en/CSS/background-size"
  }]
}
!*/
/* DOC
Detects support for `background-size: cover`, which scales a background image such that it is at least as large as the container in both dimensions
*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  // Must test value, as this specifically tests the `cover` value
  Modernizr.addTest('bgsizecover', testAllProps('backgroundSize', 'cover'));
});
