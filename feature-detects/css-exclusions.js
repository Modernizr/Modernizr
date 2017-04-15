// http://www.w3.org/TR/css3-exclusions
// Examples: http://html.adobe.com/webstandards/cssexclusions

Modernizr.addTest('exclusions', function() {
    var wrapFlowProperty = Modernizr.testAllProps("wrapFlow");
    var shapeOutsideProperty = Modernizr.testAllProps("shapeOutside");
    var shapeInsideProperty = Modernizr.testAllProps("shapeInside");

    if (!wrapFlowProperty || !shapeOutsideProperty || !shapeInsideProperty) {
        return false;
    }

    /* We should add some basic layout testing here later to determine if exclusions actually work. */

    return true;
});

