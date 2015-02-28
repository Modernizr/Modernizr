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
define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // In Safari <=5.0 `window.crypto` exists (for some reason) but is `undefined`, so we have to check
  // it’s truthy before checking for existence of `getRandomValues`
  var crypto = prefixed('crypto', window);
  Modernizr.addTest('getrandomvalues', !!crypto && 'getRandomValues' in crypto);
});
