/*!
{
  "async": false,
  "authors": ["Cătălin Mariș"],
  "name": "URLSearchParams API",
  "notes": [
    {
      "name": "WHATWG specification",
      "href": "https://url.spec.whatwg.org/#interface-urlsearchparams"
    },
    {
      "name": "MDN documentation",
      "href": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams"
    }
  ],
  "property": "urlsearchparams",
  "tags": ["querystring", "url"]
}
!*/

/* DOC
Detects support for an API that provides utility methods for working with the query string of a URL.
*/

define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('urlsearchparams', 'URLSearchParams' in window);
});
