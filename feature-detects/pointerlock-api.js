/*!
{
  "name": "Pointer Lock API",
  "property": "pointerlock",
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/API/Pointer_Lock_API"
  }],
  "builderAliases": ["pointerlock_api"]
}
!*/
/* DOC
Detects support the pointer lock API which allows you to lock the mouse cursor to the browser window.
*/
import Modernizr from 'Modernizr';

import prefixed from 'prefixed';
// https://developer.mozilla.org/en-US/docs/API/Pointer_Lock_API
Modernizr.addTest('pointerlock', !!prefixed('exitPointerLock', document));
