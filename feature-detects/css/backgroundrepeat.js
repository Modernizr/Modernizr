/*!
{
  "name": "Background Repeat",
  "property": ["bgrepeatspace", "bgrepeatround"],
  "tags": ["css"],
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
define(['Modernizr', 'testStyles', 'getStyle'], function( Modernizr, testStyles, getStyle ) {

  function getBgRepeatValue( elem ) {
    return getStyle(elem).getPropertyValue('background');
  }

  testStyles(' #modernizr { background-repeat: round; } ', function( elem, rule ) {
    Modernizr.addTest('bgrepeatround', getBgRepeatValue(elem) == 'round');
  });

  testStyles(' #modernizr { background-repeat: space; } ', function( elem, rule ) {
    Modernizr.addTest('bgrepeatspace', getBgRepeatValue(elem) == 'space');
  });

});
