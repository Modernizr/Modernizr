/*!
{
  "name": "Web Cryptography API getRandomValues method",
  "property": "getrandomvalues",
  "caniuse": "window.crypto.getRandomValues",
  "tags": ["crypto"],
  "authors": ["komachi"],
  "notes": [{
    "name": "W3C Editor’s Draft",
    "href": "https://dvcs.w3.org/hg/webcrypto-api/raw-file/tip/spec/Overview.html#RandomSource-method-getRandomValues"
  }],
  "polyfills": [
    "polycrypt"
  ]
}
!*/
/* DOC

Detects support for the window.crypto.getRandomValues for generate cryptographically secure random numbers

*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('getrandomvalues', 'crypto' in window && 'getRandomValues' in window.crypto);
});
