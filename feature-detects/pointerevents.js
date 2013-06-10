/*!
{
  "name": "DOM Pointer Events API",
  "property": "pointerevents",
  "tags": ["input"],
  "authors": ["Stu Cox"],
  "notes": [
    "This property name used to refer to the CSS `pointer-events` property, which is now named `csspointerevents`.",
    {
      "name": "W3C spec submission",
      "href": "http://www.w3.org/Submission/pointer-events/"
    }
  ],
  "warnings": ["This property name now refers to W3C DOM PointerEvents: https://github.com/Modernizr/Modernizr/issues/548#issuecomment-12812099"],
  "polyfills": ["handjs"]
}
!*/
/* DOC

Detects support for the DOM Pointer Events API, which provides a unified event interface for pointing input devices, as implemented in IE10+.

*/
define(['Modernizr', 'domPrefixes', 'hasEvent'], function( Modernizr, domPrefixes, hasEvent ) {
  // **Test name hijacked!**
  // Now refers to W3C DOM PointerEvents spec rather than the CSS pointer-events property.
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
