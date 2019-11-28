/*!
{
  "name": "DOM Pointer Events API",
  "property": "pointerevents",
  "tags": ["input"],
  "authors": ["Stu Cox"],
  "notes": [{
    "name": "W3C Spec (Pointer Events)",
    "href": "https://www.w3.org/TR/pointerevents/"
  }, {
    "name": "W3C Spec (Pointer Events Level 2)",
    "href": "https://www.w3.org/TR/pointerevents2/"
  }, {
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent"
  }],
  "warnings": ["This property name now refers to W3C DOM PointerEvents: https://github.com/Modernizr/Modernizr/issues/548#issuecomment-12812099"],
  "polyfills": ["pep"]
}
!*/
/* DOC
Detects support for the DOM Pointer Events API, which provides a unified event interface for pointing input devices, as implemented in IE10+, Edge and Blink.
*/
define(['Modernizr', 'domPrefixesAll', 'hasEvent'], function(Modernizr, domPrefixesAll, hasEvent) {
  // **Test name hijacked!**
  // Now refers to W3C DOM PointerEvents spec rather than the CSS pointer-events property.
  Modernizr.addTest('pointerevents', function() {
    // Cannot use `.prefixed()` for events, so test each prefix
    for (var i = 0, len = domPrefixesAll.length; i < len; i++) {
      if (hasEvent(domPrefixesAll[i] + 'pointerdown')) {
        return true;
      }
    }
    return false;
  });
});
