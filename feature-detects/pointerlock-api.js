/*!
{
  "name": "Pointer Lock API",
  "property": "pointerlock",
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/API/Pointer_Lock_API"
  }],
  "builderAliases": ["pointerlock_api"]
}
!*/
/* DOC
Detects support the pointer lock API which allows you to lock the mouse cursor to the browser window.
*/
import Modernizr from '../src/Modernizr.js';
import prefixed from '../src/prefixed.js';
import _globalThis from '../src/globalThis.js';

// https://developer.mozilla.org/en-US/docs/API/Pointer_Lock_API
Modernizr.addTest('pointerlock', 'document' in _globalThis && !!prefixed('exitPointerLock', document));

export default Modernizr.pointerlock
