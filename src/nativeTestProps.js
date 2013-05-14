define(['injectElementWithStyles', 'domToHyphenated'], function ( injectElementWithStyles, domToHyphenated ) {
    // Function to allow us to use native feature detection functionality if available.
    // Accepts a list of property names and a single value
    // Returns `undefined` if native detection not available
    function nativeTestProps ( props, value ) {
        var i = props.length;
        // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
        if ('CSS' in window && 'supports' in window.CSS) {
            // Try every prefixed variant of the property
            while (i--) {
                if (window.CSS.supports(domToHyphenated(props[i]), value)) {
                    return true;
                }
            }
            return false;
        }
        // Otherwise fall back to at-rule (for FF 17 and Opera 12.x)
        else if ('CSSSupportsRule' in window) {
            // Build a condition string for every prefixed variant
            var conditionText = [];
            while (i--) {
                conditionText.push('(' + domToHyphenated(props[i]) + ':' + value + ')');
            }
            conditionText = conditionText.join(' or ');
            return injectElementWithStyles('@supports (' + conditionText + ') { #modernizr { position: absolute; } }', function( node ) {
                return (window.getComputedStyle ?
                        getComputedStyle(node, null) :
                        node.currentStyle)['position'] == 'absolute';
            });
        }
        return undefined;
    }
    return nativeTestProps;
});
