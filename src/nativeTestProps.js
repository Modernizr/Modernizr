define(['injectElementWithStyles', 'prefixes'], function ( injectElementWithStyles, prefixes ) {
    // Function to allow us to use native feature detection functionality if available.
    // Accepts a list of property names and a list of values
    function nativeTestProps ( props, values ) {
        var i = props.length,
            j;
        // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
        if ('CSS' in window && 'supports' in window.CSS) {
            // Try every prefixed variant, of both property and value
            while (i--) {
                j = values.length;
                while (j--) {
                    if (window.CSS.supports(props[i], values[j])) {
                        return true;
                    }
                }
            }
            return false;
        }
        // Otherwise fall back to at-rule (for FF 17 and Opera 12.x)
        else if ('CSSSupportsRule' in window) {
            // Build a condition string for every prefixed variant
            var conditionText = [];
            while (i--) {
                j = values.length;
                while (j--) {
                    conditionText.push('(' + props[i] + ':' + values[j] + ')');
                }
            }
            conditionText = conditionText.join(' or ');
            return injectElementWithStyles('@supports (' + conditionText + ') { #modernizr { position: absolute; } }', function( node ) {
                return (window.getComputedStyle ?
                        getComputedStyle(node, null) :
                        node.currentStyle)['position'] == 'absolute';
            });
        }
        else {
            return undefined;
        }
    }
    return nativeTestProps;
});
