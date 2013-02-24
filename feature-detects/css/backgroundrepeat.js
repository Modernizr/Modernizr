/*!
{
  "name": "Background Repeat",
  "property": ["bgrepeatspace", "bgrepeatround"],
  "aliases": [],
  "tags": ["css"],
  "knownBugs": [],
  "doc" : null,
  "authors": ["Ryan Seddon"],
  "warnings": [],
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
define(['Modernizr', 'testStyles'], function( Modernizr, testStyles ) {

  function getBgRepeatValue( elem ) {
    return (window.getComputedStyle ?
            getComputedStyle(elem, null).getPropertyValue('background') :
            elem.currentStyle['background']);
  }

  testStyles(' #modernizr { background-repeat: round; } ', function( elem, rule ) {
    Modernizr.addTest('bgrepeatround', getBgRepeatValue(elem) == 'round');
  });

  testStyles(' #modernizr { background-repeat: space; } ', function( elem, rule ) {
    Modernizr.addTest('bgrepeatspace', getBgRepeatValue(elem) == 'space');
  });

});
