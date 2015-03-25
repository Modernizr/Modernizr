/*!
{
  "name": "Cross-Origin Resource Sharing",
  "property": "cors",
  "caniuse": "cors",
  "authors": ["Theodoor van Donge"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS"
  }],
  "polyfills": ["pmxdr", "ppx", "flxhr"]
}
!*/
/* DOC
Detects support for Cross-Origin Resource Sharing: the ability to make cross-domain requests.
*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('cors', ('XMLHttpRequest' in window && 'withCredentials' in new XMLHttpRequest()) 
    || 'XDomainRequest' in window);
});
