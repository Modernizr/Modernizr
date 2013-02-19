define(['injectElementWithStyles'], function ( injectElementWithStyles ) {
    // Function to allow us to use native feature detection functionality if available.
    // Only accepts the string notation, i.e.: `nativeCSSDetect('(display:flex)')`, not
    // `nativeCSSDetect('display', 'flex')`
    function nativeCSSDetect ( str ) {
        // Start with the W3C version: http://www.w3.org/TR/css3-conditional/#the-css-interface
        if ('CSS' in window && 'supports' in window.CSS) {
            return window.CSS.supports(str);
        }
        // Otherwise fall back to the at-rule for Opera: they made a bit of a hash of
        // `window.CSS.supports()`, by implementing it as `window.supportsCSS()` which
        // only supported f(property, value) calls rather than f(conditionText)
        else if ('CSSSupportsRule' in window) {
            return injectElementWithStyles('@supports ' + str + ' { #modernizr { position: absolute; } }', function( node ) {
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
