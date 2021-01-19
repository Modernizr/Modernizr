/*!
{
  "name": "ES6 String",
  "property": "es6string",
  "notes": [{
    "name": "ECMAScript 6 Specification",
    "href": "https://www.ecma-international.org/ecma-262/6.0/index.html"
  }, {
    "name": "Last ECMAScript Specification",
    "href": "https://www.ecma-international.org/ecma-262/index.html"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 String per specification.
*/
import Modernizr from '../../src/Modernizr.js';

Modernizr.addTest('es6string', !!(String.fromCodePoint &&
  String.raw &&
  String.prototype.codePointAt &&
  String.prototype.repeat &&
  String.prototype.startsWith &&
  String.prototype.endsWith &&
  String.prototype.includes)
);

export default Modernizr.es6string
