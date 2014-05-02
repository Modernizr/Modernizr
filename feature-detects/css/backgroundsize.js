/*!
{
  "name": "Background Size",
  "property": "backgroundsize",
  "tags": ["css"],
  "knownBugs": ["This will false positive in Opera Mini - http://github.com/Modernizr/Modernizr/issues/396"],
  "notes": [{
    "name": "Related Issue",
    "href": "http://github.com/Modernizr/Modernizr/issues/396"
  }]
}
!*/
/* DOC
Detects support for the `background-size` CSS property.

Note does *not* include support for `background-size: cover` – use the `backgroundsizecover` detect for that instead.
*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('backgroundsize', testAllProps('backgroundSize', '100%', true));
});
