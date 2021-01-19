/*!
{
  "name": "Typed arrays",
  "property": "typedarrays",
  "caniuse": "typedarrays",
  "tags": ["js"],
  "authors": ["Stanley Stuart (@fivetanley)"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays"
  }, {
    "name": "Kronos spec",
    "href": "http://www.ecma-international.org/ecma-262/6.0/#sec-typedarray-objects"
  }],
  "polyfills": ["joshuabell-polyfill"]
}
!*/
/* DOC
Detects support for native binary data manipulation via Typed Arrays in JavaScript.

Does not check for DataView support; use `Modernizr.dataview` for that.
*/
import Modernizr from '../src/Modernizr.js';
import _globalThis from '../src/globalThis.js';

// Should fail in:
// Internet Explorer <= 9
// Firefox <= 3.6
// Chrome <= 6.0
// iOS Safari < 4.2
// Safari < 5.1
// Opera < 11.6
// Opera Mini, <= 7.0
// Android Browser < 4.0
// Blackberry Browser < 10.0

Modernizr.addTest('typedarrays', 'ArrayBuffer' in _globalThis);

export default Modernizr.typedarrays
