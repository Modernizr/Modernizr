/*!
{
  "name": "Content Security Policy",
  "property": "contentsecuritypolicy",
  "caniuse": "contentsecuritypolicy",
  "tags": ["security"],
  "notes": [{
    "name": "W3C spec",
    "href": "http://www.w3.org/TR/CSP/"
  },{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Security/CSP"
  }]
}
!*/
/* DOC

Detects support for the Content Security Policy protocol for mitigating and reporting security attacks.

*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('contentsecuritypolicy', ('securityPolicy' in document || 'SecurityPolicy' in document));
});
