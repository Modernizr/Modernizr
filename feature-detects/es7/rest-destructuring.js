/*!
{
  "name": "ES7 Rest destructuring",
  "property": ["restdestructuringarray", "restdestructuringobject"],
  "caniuse" : "destructuring%20assignment",
  "notes": [{
    "name": "ECMAScript Destructuring Assignment Specification",
    "href": "https://tc39.es/ecma262/#sec-destructuring-assignment"
  }],
  "authors": ["dabretin"],
  "tags": ["es7"]
}
!*/
/* DOC
Check if browser implements ECMAScript 7 Destructuring Assignment per specification.
*/
import Modernizr from '../../src/Modernizr.js';
import testSyntax from '../../src/testSyntax.js';

Modernizr.addTest('restdestructuringarray', testSyntax('var [...r]=[1]'))

Modernizr.addTest('restdestructuringobject', testSyntax('var {...r}={a:1}'))

var result = {
  'restdestructuringarray': Modernizr.restdestructuringarray,
  'restdestructuringobject': Modernizr.restdestructuringobject
}

export default result
export const restdestructuringarray = Modernizr.restdestructuringarray
export const restdestructuringobject = Modernizr.restdestructuringobject
