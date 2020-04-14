/*!
{
  "name": "ES6 Math",
  "property": "es6math",
  "notes": [{
    "name": "unofficial ECMAScript 6 draft specification",
    "href": "https://web.archive.org/web/20180825202128/https://tc39.github.io/ecma262/"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "warnings": ["ECMAScript 6 is still a only a draft, so this detect may not match the final specification or implementations."],
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
