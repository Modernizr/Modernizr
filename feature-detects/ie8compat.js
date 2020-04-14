/*!
{
  "name": "IE8 compat mode",
  "property": "ie8compat",
  "authors": ["Erich Ocean"]
}
!*/
/* DOC
Detects whether or not the current browser is IE8 in compatibility mode (i.e. acting as IE7).
*/
import Modernizr from '../src/Modernizr.js';
import _globalThis from '../src/globalThis.js';
var doc = _globalThis.document

// In this case, IE8 will be acting as IE7. You may choose to remove features in this case.

// related:
// james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/


Modernizr.addTest('ie8compat', (!_globalThis.addEventListener && !!doc.documentMode && doc.documentMode === 7));

export default Modernizr.ie8compat
