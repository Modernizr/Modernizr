/*!
{
  "name": "Beacon API",
  "caniuse": "beacon",
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/navigator.sendBeacon"
  }, {
    "name": "W3C Spec",
    "href": "https://w3c.github.io/beacon/"
  }],
  "property": "beacon",
  "tags": ["beacon", "network"],
  "authors": ["Cătălin Mariș"]
}
!*/
/* DOC
Detects support for an API that allows for asynchronous transfer of small HTTP data from the client to a server.
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('beacon', 'sendBeacon' in _globalThis.navigator);

export default Modernizr.beacon
