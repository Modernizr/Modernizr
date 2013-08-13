/*!
{
  "name": "CSS Shapes",
  "property": "shapes",
  "tags": ["css"],
  "notes": [{
    "name": "CSS Shapes W3C specification",
    "href": "http://www.w3.org/TR/css-shapes"
  },{
    "name": "Examples from Adobe",
    "href": "http://html.adobe.com/webplatform/layout/shapes"
  }, {
    "name": "Samples showcasing uses of Shapes",
    "href": "http://codepen.io/collection/qFesk"
  }]
}
!*/
define(['Modernizr', 'createElement', 'docElement', 'prefixed', 'testStyles'], function( Modernizr, createElement, docElement, prefixed, testStyles ) {
    // Separate test for CSS shapes as WebKit has just implemented this alone
    Modernizr.addTest('shapes', function () {
        var prefixedProperty = prefixed('shapeInside');

        if (!prefixedProperty)
            return false;

        var shapeInsideProperty = prefixedProperty.replace(/([A-Z])/g, function (str, m1) { return '-' + m1.toLowerCase(); }).replace(/^ms-/, '-ms-');

        return testStyles('#modernizr { ' + shapeInsideProperty + ':rectangle(0,0,0,0,0,0) }', function (elem) {
            // Check against computed value
            var styleObj = window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle;
            return styleObj[prefixed('shapeInside', docElement.style, false)] == 'rectangle(0px, 0px, 0px, 0px, 0px, 0px)';
        });
    });
});
