/*!
{
  "property": "urlsearchparams",
  "caniuse": "urlsearchparams",
  "tags": ["querystring", "url"],
  "authors": ["Cătălin Mariș"],
  "name": "URLSearchParams API",
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://url.spec.whatwg.org/#interface-urlsearchparams"
  }, {
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams"
  }]
}
!*/
/* DOC
Detects support for an API that provides utility methods for working with the query string of a URL.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('urlsearchparams', 'URLSearchParams' in window);
});
