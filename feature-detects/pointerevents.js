/*!
{
  "name": "DOM Pointer Events API",
  "property": "pointerevents",
  "tags": ["input"],
  "authors": ["Stu Cox"],
  "notes": [
    {
      "name": "W3C Pointer Events",
      "href": "https://www.w3.org/TR/pointerevents/"
    },{
      "name": "W3C Pointer Events Level 2",
      "href": "https://www.w3.org/TR/pointerevents2/"
    },{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent"
  }],
  "warnings": ["This property name now refers to W3C DOM PointerEvents: https://github.com/Modernizr/Modernizr/issues/548#issuecomment-12812099"],
  "polyfills": ["pep"]
}
!*/
/* DOC
Detects support for the DOM Pointer Events API, which provides a unified event interface for pointing input devices, as implemented in IE10+, Edge and Blink.
*/
define(['Modernizr', 'domPrefixes', 'hasEvent'], function(Modernizr, domPrefixes, hasEvent) {
  // **Test name hijacked!**
  // Now refers to W3C DOM PointerEvents spec rather than the CSS pointer-events property.
  Modernizr.addTest('pointerevents', function() {
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
