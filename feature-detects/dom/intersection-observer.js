/*!
{
  "name": "Intersection Observer",
  "property": "intersectionobserver",
  "caniuse": "intersectionobserver",
  "tags": ["dom"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://w3c.github.io/IntersectionObserver/"
  }, {
    "name": "IntersectionObserver polyfill",
    "href": "https://github.com/w3c/IntersectionObserver/tree/master/polyfill"
  }, {
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/docs/Web/API/Intersection_Observer_API"
  }]
}
!*/
/* DOC
 Determines if Intersection Observer API is available.
 */
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('intersectionobserver', 'IntersectionObserver' in _globalThis);

export default Modernizr.intersectionobserver
