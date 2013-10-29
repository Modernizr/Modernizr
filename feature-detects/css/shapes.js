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
define(['Modernizr', 'createElement', 'docElement', 'prefixed', 'testStyles'], function(Modernizr, createElement, docElement, prefixed, testStyles ) {
    Modernizr.addTest('shapes', function () {
        var prefixedProperty = prefixed('shapeOutside');

        if (!prefixedProperty)
            return false;

        var shapeOutsideProperty = prefixedProperty.replace(/([A-Z])/g, function (str, m1) { return '-' + m1.toLowerCase(); }).replace(/^ms-/, '-ms-');

        return testStyles('#modernizr { float: left; ' + shapeOutsideProperty + ':rectangle(0,0,0,0,0,0) }', function (elem) {
            // Check against computed value
            var styleObj = window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle;
            return styleObj[prefixed('shapeOutside', docElement.style, false)] == 'rectangle(0px, 0px, 0px, 0px, 0px, 0px)';
        });
    });
});
