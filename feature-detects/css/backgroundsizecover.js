/*!
{
  "name": "Background Size Cover",
  "property": "bgsizecover",
  "aliases": [],
  "tags": ["css"],
  "knownBugs": [],
  "doc" : null,
  "authors": [],
  "warnings": [],
  "notes": [{
    "name" : "MDN Docs",
    "href": "http://developer.mozilla.org/en/CSS/background-size"
  }]
}
!*/
define(['Modernizr', 'testStyles'], function( Modernizr, testStyles ) {

  testStyles('#modernizr{background-size:cover}', function( elem ) {
    var style = window.getComputedStyle ?
      window.getComputedStyle(elem, null)
      : elem.currentStyle;

    Modernizr.addTest('bgsizecover', style.backgroundSize == 'cover' );
  });

});
