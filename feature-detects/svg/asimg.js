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

    // 1px x 1px SVG; must be base64 or URI encoded for IE9... base64 is shorter
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
  });
});
