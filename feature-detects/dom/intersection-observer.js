/*!
{
  "name": "Intersection Observer",
  "property": "intersectionobserver",
  "caniuse": "intersectionobserver",
  "tags": ["dom"],
  "notes": [{
    "name": "W3C. API Sketch for Intersection Observers",
    "href": "https://w3c.github.io/IntersectionObserver/"
  }, {
    "name": "IntersectionObserver polyfill",
    "href": "https://github.com/w3c/IntersectionObserver/tree/master/polyfill"
  }, {
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/ru/docs/Web/API/Intersection_Observer_API"
  }]
}
!*/
/* DOC

 Determines if Intersection Observer API is available.

 */
define(['Modernizr'], function (Modernizr) {
  Modernizr.addTest(
    'intersectionobserver',
    function () {
      if ('IntersectionObserver' in window &&
        'IntersectionObserverEntry' in window &&
        'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
        // Minimal polyfill for Edge 15's lack of `isIntersecting`
        // See: https://github.com/w3c/IntersectionObserver/issues/211
        if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
          Object.defineProperty(window.IntersectionObserverEntry.prototype,
            'isIntersecting', {
              get: function () {
                return this.intersectionRatio > 0;
              }
            });
        }
        return true;
      }
      return false;
    });
});
