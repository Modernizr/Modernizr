define(['Modernizr', 'createElement', 'docElement', 'prefixed', 'testStyles', 'getStyle'], function( Modernizr, createElement, docElement, prefixed, testStyles, getStyle ) {
    // http://www.w3.org/TR/css3-exclusions
    // http://www.w3.org/TR/css3-exclusions/#shapes
    // Examples: http://html.adobe.com/webstandards/cssexclusions
    // Separate test for CSS shapes as WebKit has just implemented this alone
    Modernizr.addTest('shapes', function () {
        var prefixedProperty = prefixed('shapeInside');

        if (!prefixedProperty)
            return false;

        var shapeInsideProperty = prefixedProperty.replace(/([A-Z])/g, function (str, m1) { return '-' + m1.toLowerCase(); }).replace(/^ms-/, '-ms-');

        return testStyles('#modernizr { ' + shapeInsideProperty + ':rectangle(0,0,0,0) }', function (elem) {
            // Check against computed value
            return getStyle(elem).getPropertyValue(prefixed('shapeInside', docElement.style, false)) == 'rectangle(0px, 0px, 0px, 0px)';
        });
    });
});
