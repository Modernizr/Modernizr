define(['injectElementWithStyles', 'prefixes'], function ( injectElementWithStyles, prefixes ) {
    // Function to allow us to use native feature detection functionality if available.
    // Follows `(DOMString property, DOMString value)` interface
    function nativeCSSDetect ( property, value, isPropPrefixed, isValuePrefixed ) {
        var propPrefixes = isPropPrefixed ? prefixes : [''],
            valuePrefixes = isValuePrefixed ? prefixes : [''],
            i = propPrefixes.length;
        // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
        if ('CSS' in window && 'supports' in window.CSS) {
            // Try every prefixed variant, of both property and value
            while (i--) {
                j = valuePrefixes.length;
                while (j--) {
                    if (window.CSS.supports(prefixes[i] + property, prefixes[j] + value)) {
                        return true;
                    }
                }
            }
            return false;
        }
        // Otherwise fall back to at-rule
        else if ('CSSSupportsRule' in window) {
            // Build a condition string for every prefixed variant
            var conditionText = [];
            while (i--) {
                j = valuePrefixes.length;
                while (j--) {
                    conditionText.push('(' + prefixes[i] + property + ':' + prefixes[j] + value + ')');
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
    return nativeCSSDetect;
});
