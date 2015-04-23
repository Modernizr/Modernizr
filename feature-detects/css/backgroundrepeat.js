/*!
{
  "name": "Background Repeat",
  "property": ["bgrepeatspace", "bgrepeatround"],
  "tags": ["css"],
  "builderAliases": ["css_backgroundrepeat"],
  "authors": ["Ryan Seddon"],
  "notes": [{
    "name": "MDN Docs",
    "href": "http://developer.mozilla.org/en/CSS/background-repeat"
  }, {
    "name": "Test Page",
    "href": "http://jsbin.com/uzesun/"
  }, {
    "name": "Demo",
    "href": "http://jsfiddle.net/ryanseddon/yMLTQ/6/"
  }]
}
!*/
/* DOC
Detects the ability to use round and space as properties for background-repeat
*/
define(['Modernizr', 'testAllProps'], function(Modernizr, testAllProps) {
  // Must value-test these
  Modernizr.addTest('bgrepeatround', testAllProps('backgroundRepeat', 'round'));
  Modernizr.addTest('bgrepeatspace', testAllProps('backgroundRepeat', 'space'));
});
