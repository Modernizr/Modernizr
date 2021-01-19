/*!
{
  "name": "ES6 Class",
  "property": "es6class",
  "notes": [{
    "name": "ECMAScript 6 language specification",
    "href": "https://www.ecma-international.org/ecma-262/6.0/#sec-class-definitions"
  }],
  "caniuse": "es6-class",
  "authors": ["dabretin"],
  "tags": ["es6"],
  "builderAliases": ["class"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 class.
*/
import Modernizr from '../../src/Modernizr.js';
import testSyntax from '../../src/testSyntax.js';

Modernizr.addTest('es6class', testSyntax('class A{}'))

export default Modernizr.es6class
