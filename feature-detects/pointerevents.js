define(['Modernizr', 'domPrefixes', 'hasEvent'], function( Modernizr, domPrefixes, hasEvent ) {
  // **Test name hijacked!**
  // Now refers to W3C DOM PointerEvents spec: http://www.w3.org/Submission/pointer-events/
  // For CSS pointer-events test, see feature-detects/css/pointerevents.js
  Modernizr.addTest('pointerevents', function () {
    // Cannot use `.prefixed()` for events, so test each prefix
    var bool = false,
        i = domPrefixes.length;

    // Don't forget un-prefixed...
    bool = Modernizr.hasEvent('pointerdown');

    while (i-- && !bool) {
        if (hasEvent(domPrefixes[i] + 'pointerdown')) {
            bool = true;
        }
    }
    return bool;
  });
});
