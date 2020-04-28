/*!
{
  "name": "ES5 Immutable Undefined",
  "property": "es5undefined",
  "notes": [{
    "name": "ECMAScript 5.1 Language Specification",
    "href": "https://www.ecma-international.org/ecma-262/5.1/"
  }, {
    "name": "original implementation of detect code",
    "href": "https://kangax.github.io/compat-table/es5/"
  }],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "tags": ["es5"]
}
!*/
/* DOC
Check if browser prevents assignment to global `undefined` per ECMAScript 5.
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('es5undefined', function() {
  var result, originalUndefined;
  try {
    originalUndefined = _globalThis.undefined;
    _globalThis.undefined = 12345;
    result = typeof _globalThis.undefined === 'undefined';
    _globalThis.undefined = originalUndefined;
  } catch (e) {
    return false;
  }
  return result;
});

export default Modernizr.es5undefined
