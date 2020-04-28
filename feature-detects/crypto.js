/*!
{
  "name": "Web Cryptography",
  "property": "cryptography",
  "caniuse": "cryptography",
  "tags": ["crypto"],
  "authors": ["roblarsen"],
  "notes": [{
    "name": "W3C Editor's Draft Spec",
    "href": "https://www.w3.org/TR/WebCryptoAPI/"
  }],
  "polyfills": ["polycrypt"]
}
!*/
/* DOC
Detects support for the cryptographic functionality available under window.crypto.subtle
*/
import Modernizr from '../src/Modernizr.js';
import prefixed from '../src/prefixed.js';
import _globalThis from '../src/globalThis.js';

var crypto = prefixed('crypto', _globalThis);
Modernizr.addTest('crypto', !!prefixed('subtle', crypto));

export default Modernizr.crypto;
