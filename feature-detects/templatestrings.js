/*!
{
  "name": "Template strings",
  "property": "templatestrings",
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Browser_compatibility"
  }]
}
!*/
/* DOC
Template strings are string literals allowing embedded expressions.
*/
import Modernizr from '../src/Modernizr.js';
import testSyntax from '../src/testSyntax.js';

Modernizr.addTest('templatestrings', testSyntax('``'))

export default Modernizr.templatestrings
