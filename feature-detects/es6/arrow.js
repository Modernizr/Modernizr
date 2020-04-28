/*!
{
  "name": "ES6 Arrow Functions",
  "property": "arrow",
  "authors": ["Vincent Riemer"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Arrow Functions per specification.
*/
import Modernizr from '../../src/Modernizr.js';
import testSyntax from '../../src/testSyntax.js';

Modernizr.addTest('arrow', testSyntax('()=>{}'));

export default Modernizr.arrow
