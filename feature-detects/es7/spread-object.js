/*!
{
  "name": "ES7 Spread object",
  "property": "spreadobject",
  "notes": [{
    "name": "ECMAScript array Specification",
    "href": "http://www.ecma-international.org/ecma-262/#sec-object-initializer"
  }],
  "authors": ["dabretin"],
  "tags": ["es7"]
}
!*/
/* DOC
Check if browser implements ECMAScript 7 object spread syntax 
*/
import Modernizr from '../../src/Modernizr.js';
import testSyntax from '../../src/testSyntax.js';

Modernizr.addTest('spreadobject', testSyntax('var a={...{b:1}}'))

export default Modernizr.spreadobject
