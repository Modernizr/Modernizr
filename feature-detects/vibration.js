/*!
{
  "name": "Vibration API",
  "property": "vibrate",
  "caniuse": "vibration",
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/DOM/window.navigator.mozVibrate"
  }, {
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/vibration/"
  }]
}
!*/
/* DOC
Detects support for the API that provides access to the vibration mechanism of the hosting device, to provide tactile feedback.
*/
import Modernizr from '../src/Modernizr.js';
import prefixed from '../src/prefixed.js';
import _globalThis from '../src/globalThis.js';

Modernizr.addTest('vibrate', !!prefixed('vibrate', _globalThis.navigator));

export default Modernizr.vibrate
