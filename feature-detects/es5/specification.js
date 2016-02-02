/*!
{
  "name": "ES5",
  "property": "es5",
  "notes": [{
    "name": "ECMAScript 5.1 Language Specification",
    "href": "http://www.ecma-international.org/ecma-262/5.1/"
  }],
  "polyfills": ["es5shim", "es5sham"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "tags": ["es5"]
}
!*/
/* DOC
Check if browser implements everything as specified in ECMAScript 5.
*/
/*!
{
  "name": "ES5",
  "property": "es5",
  "notes": [{
    "name": "ECMAScript 5.1 Language Specification",
    "href": "http://www.ecma-international.org/ecma-262/5.1/"
  }],
  "polyfills": ["es5shim", "es5sham"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "tags": ["es5"]
}
!*/
/* DOC
Check if browser implements everything as specified in ECMAScript 5.
*/
import Modernizr from 'Modernizr';

import 'test/es5/array';
import 'test/es5/date';
import 'test/es5/function';
import 'test/es5/object';
import 'test/es5/strictmode';
import 'test/es5/string';
import 'test/json';
import 'test/es5/syntax';
import 'test/es5/undefined';
Modernizr.addTest('es5', function() {
  return !!(
    Modernizr.es5array &&
    Modernizr.es5date &&
    Modernizr.es5function &&
    Modernizr.es5object &&
    Modernizr.strictmode &&
    Modernizr.es5string &&
    Modernizr.json &&
    Modernizr.es5syntax &&
    Modernizr.es5undefined
  );
});