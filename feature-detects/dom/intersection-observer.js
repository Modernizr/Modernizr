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
    "href": "https://developer.mozilla.org/en/docs/Web/API/Intersection_Observer_API"
  }]
}
!*/
/* DOC
 Determines if Intersection Observer API is available.
 */
define(['Modernizr'], function (Modernizr) {
  Modernizr.addTest('intersectionobserver', 'IntersectionObserver' in window);
});
