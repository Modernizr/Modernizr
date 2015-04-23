/*!
{
  "name": "iframe[sandbox] Attribute",
  "property": "sandbox",
  "tags": ["iframe"],
  "builderAliases": ["iframe_sandbox"],
  "notes": [
  {
    "name": "WhatWG Spec",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/the-iframe-element.html#attr-iframe-sandbox"
  }],
  "knownBugs": [ "False-positive on Firefox < 29" ]
}
!*/
/* DOC
Test for `sandbox` attribute in iframes.
*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  Modernizr.addTest('sandbox', 'sandbox' in createElement('iframe'));
});
