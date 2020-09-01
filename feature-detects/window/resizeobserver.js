/*!
{
  "name": "ResizeObserver",
  "property": "resizeobserver",
  "caniuse": "resizeobserver",
  "tags": ["ResizeObserver"],
  "authors": ["Christian Andersson"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/resize-observer/"
  }, {
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver"
  }, {
    "name": "Web.dev Article",
    "href": "https://web.dev/resize-observer/"
  }, {
    "name": "Digital Ocean tutorial",
    "href": "https://www.digitalocean.com/community/tutorials/js-resize-observer"
  }]
}
!*/
/* DOC
Detects support for ResizeObserver.
*/
import Modernizr from '../../src/Modernizr.js';

Modernizr.addTest('resizeobserver', 'ResizeObserver' in window);

export default Modernizr.resizeobserver
