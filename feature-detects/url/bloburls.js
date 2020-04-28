/*!
{
  "name": "Blob URLs",
  "property": "bloburls",
  "caniuse": "bloburls",
  "notes": [{
    "name": "W3C Working Draft Spec",
    "href": "https://www.w3.org/TR/FileAPI/#creating-revoking"
  }],
  "tags": ["file", "url"],
  "authors": ["Ron Waldon (@jokeyrhyme)"]
}
!*/
/* DOC
Detects support for creating Blob URLs
*/
import Modernizr from '../../src/Modernizr.js';
import prefixed from '../../src/prefixed.js';
import _globalThis from '../../src/globalThis.js';

var url = prefixed('URL', _globalThis, false);
url = url && _globalThis[url];
Modernizr.addTest('bloburls', url && 'revokeObjectURL' in url && 'createObjectURL' in url);

export default Modernizr.bloburls
