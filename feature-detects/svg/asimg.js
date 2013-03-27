/*!
{
  "name": "SVG as an <img> tag source",
  "property": "svgasimg",
  "caniuse" : "svg-img",
  "tags": ["svg"],
  "authors": ["Stu Cox"],
  "async" : true,
  "notes": [{
    "name": "HTML5 Spec",
    "href": "http://www.w3.org/TR/html5/embedded-content-0.html#the-img-element"
  }]
}
!*/
define(['Modernizr', 'addTest'], function( Modernizr, addTest ) {
  // Assumes data URI support, but according to caniuse every browser which
  // supports SVG in an <img> also supports data URIs
  Modernizr.addAsyncTest(function () {
    var img = new Image();

    img.onerror = function () {
      addTest('svgasimg', false);
    };
    img.onload = function () {
      addTest('svgasimg', img.width == 1 && img.height == 1);
    };

    // Simplest detectable SVG I know of (base64 would take up more bytes)
    img.src = 'data:image/svg+xml,<?xml version="1.0"?><svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"></svg>';
  });
});
