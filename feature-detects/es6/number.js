/*!
{
  "name": "ES6 Number",
  "property": "es6number",
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
Check if browser implements ECMAScript 6 Number per specification.
*/
import Modernizr from '../../src/Modernizr.js';

Modernizr.addTest('es6number', !!(Number.isFinite &&
  Number.isInteger &&
  Number.isSafeInteger &&
  Number.isNaN &&
  Number.parseInt &&
  Number.parseFloat &&
  Number.isInteger(Number.MAX_SAFE_INTEGER) &&
  Number.isInteger(Number.MIN_SAFE_INTEGER) &&
  Number.isFinite(Number.EPSILON)));

export default Modernizr.es6number
