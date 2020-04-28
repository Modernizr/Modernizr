/*!
{
  "name": "ES6 Template Strings",
  "property": "stringtemplate",
  "caniuse": "template-literals",
  "builderAliases": ["templatestrings"],
  "notes": [{
    "name": "ECMAScript 6 draft specification",
    "href": "https://tc39wiki.calculist.org/es6/template-strings/"
  }],
  "authors": ["dabretin"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 String template.
*/
import Modernizr from '../../src/Modernizr.js';
import testSyntax from '../../src/testSyntax.js';

Modernizr.addTest('stringtemplate', testSyntax('``'))

export default Modernizr.stringtemplate
