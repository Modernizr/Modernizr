/*!
{
  "name": "iframe[seamless] Attribute",
  "property": "seamless",
  "tags": ["iframe"],
  "notes": [{
    "name": "WhatWG Spec",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/the-iframe-element.html#attr-iframe-seamless"
  }]
}
!*/
/* DOC

Test for `seamless` attribute in iframes.

*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('seamless', 'seamless' in createElement('iframe'));
});
