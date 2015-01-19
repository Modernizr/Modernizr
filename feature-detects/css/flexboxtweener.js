/*!
{
  "name": "Flexbox (tweener)",
  "property": "flexboxtweener",
  "tags": ["css"],
  "polyfills": ["flexie"],
  "notes": [{
    "name": "The _inbetween_ flexbox",
    "href": "http://www.w3.org/TR/2011/WD-css3-flexbox-20111129/"
  }]
}
!*/
/* DOC
Detects the in between flexbox syntax that shipped in IE11.
*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('flexboxtweener', testAllProps('flexAlign', 'end', true));
});
