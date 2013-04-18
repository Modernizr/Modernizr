/*!
{
  "name": "Background Size Cover",
  "property": "bgsizecover",
  "tags": ["css"],
  "notes": [{
    "name" : "MDN Docs",
    "href": "http://developer.mozilla.org/en/CSS/background-size"
  }]
}
!*/
define(['Modernizr', 'testStyles', 'getStyle'], function( Modernizr, testStyles, getStyle ) {

  testStyles('#modernizr{background-size:cover}', function( elem ) {
    Modernizr.addTest('bgsizecover', getStyle(elem).getPropertyValue('backgroundSize') == 'cover' );
  });

});
