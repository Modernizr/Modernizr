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
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('backgroundsize', testAllProps('backgroundSize', '100%', true));
});
