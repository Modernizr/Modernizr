/*!
{
  "name": "Flexbox (tweener)",
  "property": "flexboxtweener",
  "tags": ["css"],
  "polyfills": ["flexie"],
  "notes": [{
    "name": "The _inbetween_ flexbox",
    "href": "http://www.w3.org/TR/2011/WD-css3-flexbox-20111129/"
  }],
  "warnings": ["This represents an old syntax, not the latest standard syntax."]
}
!*/
/* DOC
Detects support for the 2011 ‘tweener’ syntax for flexible box layout, as implemented in IE10 & IE11.

See the `flexbox` detect for information on how to use multiple flexbox detects together.
*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('flexboxtweener', testAllProps('flexAlign', 'end', true));
});
