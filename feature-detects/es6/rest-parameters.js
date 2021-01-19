/*!
{
  "name": "ES6 Rest parameters",
  "property": "restparameters",
  "notes": [{
    "name": "ECMAScript 6 language specification",
    "href": "https://www.ecma-international.org/ecma-262/6.0/#sec-function-definitions"
  }],
  "caniuse": "rest",
  "authors": ["dabretin"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Rest parameters per specification.
*/
import Modernizr from '../../src/Modernizr.js';
import testSyntax from '../../src/testSyntax.js';

Modernizr.addTest('restparameters', testSyntax('function f(...r) {}'))

export default Modernizr.restparameters
