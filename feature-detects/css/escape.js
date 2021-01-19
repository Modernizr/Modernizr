/*!
{
  "name": "CSS.escape()",
  "property": "cssescape",
  "polyfills": ["css-escape"],
  "tags": ["css", "cssom"]
}
!*/
/* DOC
Tests for `CSS.escape()` support.
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

var CSS = _globalThis.CSS;
Modernizr.addTest('cssescape', CSS ? typeof CSS.escape === 'function' : false);

export default Modernizr.cssescape
