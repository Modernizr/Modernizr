/*!
{
  "name": "Framed _globalThis",
  "property": "framed",
  "tags": ["_globalThis"],
  "builderAliases": ["_globalThis_framed"]
}
!*/
/* DOC
Tests if page is iframed.
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

// github.com/Modernizr/Modernizr/issues/242

Modernizr.addTest('framed', _globalThis.location !== _globalThis.top.location);

export default Modernizr.framed
