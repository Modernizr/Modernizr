/*!
{
  "name": "getRandomValues",
  "property": "getrandomvalues",
  "caniuse": "getrandomvalues",
  "tags": ["crypto"],
  "authors": ["komachi"],
  "notes": [{
    "name": "W3C Editor’s Draft Spec",
    "href": "https://w3c.github.io/webcrypto/#Crypto-interface-methods"
  }],
  "polyfills": ["polycrypt"]
}
!*/
/* DOC
Detects support for the window.crypto.getRandomValues method for generating cryptographically secure random numbers
*/
import Modernizr from '../../src/Modernizr.js';
import prefixed from '../../src/prefixed.js';
import is from '../../src/is.js';
import _globalThis from '../../src/globalThis.js';


// In Safari <=5.0 `_globalThis.crypto` exists (for some reason) but is `undefined`, so we have to check
// it’s truthy before checking for existence of `getRandomValues`
var crypto = prefixed('crypto', _globalThis);
var supportsGetRandomValues;

// Safari 6.0 supports crypto.getRandomValues, but does not return the array,
// which is required by the spec, so we need to actually check.
if (crypto && 'getRandomValues' in crypto && 'Uint32Array' in _globalThis) {
  var array = new Uint32Array(10);
  var values = crypto.getRandomValues(array);
  supportsGetRandomValues = values && is(values[0], 'number');
}

Modernizr.addTest('getrandomvalues', !!supportsGetRandomValues);

export default Modernizr.getrandomvalues;
