/*!
{
  "name": "Background Position Shorthand",
  "property": "bgpositionshorthand",
  "tags": ["css"],
  "builderAliases": ["css_backgroundposition_shorthand"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/CSS/background-position"
  }, {
    "name": "W3 Spec",
    "href": "http://www.w3.org/TR/css3-background/#background-position"
  }, {
    "name": "Demo",
    "href": "http://jsfiddle.net/Blink/bBXvt/"
  }]
}
!*/
/*
Detects if you can use the shorthand method to define multiple parts of an
element's background-position simultaniously.

eg `background-position: right 10px bottom 10px`
*/
define(['Modernizr', 'setCss', 'createElement'], function( Modernizr, setCss, createElement ) {
  Modernizr.addTest('bgpositionshorthand', function() {
    var elem = createElement('a');
    var val = 'right 10px bottom 10px';
    setCss(elem, 'background-position: ' + val + ';');
    return (elem.style.backgroundPosition === val);
  });
});
