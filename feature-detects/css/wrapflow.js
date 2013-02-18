define(['Modernizr', 'prefixed', 'docElement'], function( Modernizr, prefixed, docElement ) {
    // http://www.w3.org/TR/css3-exclusions
    // Examples: http://html.adobe.com/webstandards/cssexclusions
    // Separate test for `wrap-flow` property as IE10 has just implemented this alone
    Modernizr.addTest('wrapflow', function () {
        var prefixedProperty = prefixed('wrapFlow'),
            wrapFlowProperty;

        if (!prefixedProperty)
            return false;

        wrapFlowProperty = prefixedProperty.replace(/([A-Z])/g, function (str, m1) { return '-' + m1.toLowerCase(); }).replace(/^ms-/, '-ms-');

        return Modernizr.testStyles('#modernizr { ' + wrapFlowProperty + ':start }', function (elem) {
            // Check against computed value
            var styleObj = window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle;
            return styleObj[prefixed('wrapFlow', docElement.style, false)] == 'start';
        });
    });
});
