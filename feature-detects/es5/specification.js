/*!
{
  "name": "ES5",
  "property": "es5",
  "caniuse": "es5",
  "notes": [{
    "name": "ECMAScript 5.1 Language Specification",
    "href": "https://www.ecma-international.org/ecma-262/5.1/"
  }],
  "polyfills": ["es5shim", "es5sham"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "tags": ["es5"]
}
!*/
/* DOC
Check if browser implements everything as specified in ECMAScript 5.
*/
import Modernizr from '../../src/Modernizr.js';
import array from './array.js';
import date from './date.js';
import func from './function.js';
import object from './object.js';
import strictmode from './strictmode.js';
import string from './string.js';
import json from '../json.js';
import syntax from './syntax.js';
import undef from './undefined.js';

Modernizr.addTest('es5', function() {
  return !!(
    array &&
    date &&
    func &&
    object &&
    strictmode &&
    string &&
    json &&
    syntax &&
    undef
  );
});

export default Modernizr.es5
