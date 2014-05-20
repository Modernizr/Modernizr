/*!
{
  "name": "Flexbox (legacy)",
  "property": "flexboxlegacy",
  "tags": ["css"],
  "polyfills": ["flexie"],
  "notes": [{
    "name": "The _old_ flexbox",
    "href": "http://www.w3.org/TR/2009/WD-css3-flexbox-20090723/"
  }]
}
!*/
/* DOC
Detects support for the 2009 ‘legacy’ syntax for flexible box layout.

See the `flexbox` detect for information on how to use multiple flexbox detects together.
*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('flexboxlegacy', testAllProps('boxDirection', 'reverse', true));
});
