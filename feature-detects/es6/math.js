/*!
{
  "name": "ES6 Math",
  "property": "es6math",
  "notes": [{
    "name": "ECMAScript 6 specification",
    "href": "https://www.ecma-international.org/ecma-262/6.0/index.html"
  }, {
    "name": "Last ECMAScript specification",
    "href": "https://www.ecma-international.org/ecma-262/index.html"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Math per specification.
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';
var M = _globalThis.Math

Modernizr.addTest('es6math', !!(M &&
  M.clz32 &&
  M.cbrt &&
  M.imul &&
  M.sign &&
  M.log10 &&
  M.log2 &&
  M.log1p &&
  M.expm1 &&
  M.cosh &&
  M.sinh &&
  M.tanh &&
  M.acosh &&
  M.asinh &&
  M.atanh &&
  M.hypot &&
  M.trunc &&
  M.fround));

export default Modernizr.es6math
