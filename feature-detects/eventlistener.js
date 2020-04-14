/*!
{
  "name": "Event Listener",
  "property": "eventlistener",
  "caniuse": "addeventlistener",
  "authors": ["Andrew Betts (@triblondon)"],
  "caniuse": "addeventlistener",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Registration-interfaces"
  }],
  "polyfills": ["eventlistener"]
}
!*/
/* DOC
Detects native support for addEventListener
*/
import Modernizr from '../src/Modernizr.js';
import _globalThis from '../src/globalThis.js';

Modernizr.addTest('eventlistener', 'addEventListener' in _globalThis);

export default Modernizr.eventlistener
