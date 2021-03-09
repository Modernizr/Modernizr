/*!
{
  "name": "CustomEvent",
  "property": "customevent",
  "tags": ["customevent"],
  "authors": ["Alberto Elias"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/DOM-Level-3-Events/#interface-CustomEvent"
  }, {
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/docs/Web/API/CustomEvent"
  }],
  "polyfills": ["eventlistener"]
}
!*/
/* DOC
Detects support for CustomEvent.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('customevent', 'CustomEvent' in window && typeof window.CustomEvent === 'function');
});
