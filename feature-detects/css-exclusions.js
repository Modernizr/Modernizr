// http://www.w3.org/TR/css3-exclusions
// Examples: http://html.adobe.com/webstandards/cssexclusions

// Get prefixed & hyphenated, e.g. input: 'wrapFlow' output: '-webkit-wrap-flow' or false
function getPrefixedHyphenatedCSSproperty(prop) {
    var prefixedProperty = Modernizr.prefixed(prop);
    if (!prefixedProperty)
        return false;
    return prefixedProperty.replace(/([A-Z])/g, function (str, m1) { return '-' + m1.toLowerCase(); }).replace(/^ms-/, '-ms-');
}

// Get prefixed & camel case, e.g. input: 'wrapFlow' output: 'webkitWrapFlow'
function getPrefixedCamelCaseCSSproperty(prop) {
    return Modernizr.prefixed(prop, document.documentElement.style, false);
}

Modernizr.addTest('exclusions', function () {
    var wrapFlowProperty = getPrefixedHyphenatedCSSproperty('wrapFlow');
    var shapeOutsideProperty = getPrefixedHyphenatedCSSproperty('shapeOutside');
    var shapeInsideProperty = getPrefixedHyphenatedCSSproperty('shapeInside');

    if (!wrapFlowProperty || !shapeOutsideProperty || !shapeInsideProperty) {
        return false;
    }

    var wrapFlow = Modernizr.testStyles('#modernizr { ' + wrapFlowProperty + ':start }', function (elem) {
        // Check against computed value
        var styleObj = window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle;
        return styleObj[getPrefixedCamelCaseCSSproperty('wrapFlow')] == 'start';
    });

    var shapeOutside = Modernizr.testStyles('#modernizr { ' + shapeOutsideProperty + ':rectangle(0px, 0px, 100px, 150px) }', function (elem) {
        // Check against computed value
        var styleObj = window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle;
        return styleObj[getPrefixedCamelCaseCSSproperty('shapeOutside')] == 'rectangle(0px, 0px, 100px, 150px)';
    });

    var shapeInside = Modernizr.testStyles('#modernizr { ' + shapeInsideProperty + ':rectangle(0px, 0px, 100%, 100%, 25%, 25%) }', function (elem) {
        // Check against computed value
        var styleObj = window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle;
        return styleObj[getPrefixedCamelCaseCSSproperty('shapeInside')] == 'rectangle(0px, 0px, 100%, 100%, 25%, 25%)';
    });

    return wrapFlow && shapeOutside && shapeInside;
});
