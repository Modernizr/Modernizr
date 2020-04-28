/*!
{
  "name": "getUserMedia",
  "property": "getusermedia",
  "caniuse": "stream",
  "tags": ["webrtc"],
  "authors": ["Eric Bidelman", "Masataka Yakura"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://w3c.github.io/mediacapture-main/#dom-mediadevices-getusermedia"
  }]
}
!*/
/* DOC
Detects support for the new Promise-based `getUserMedia` API.
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('getUserMedia', 'mediaDevices' in _globalThis.navigator && 'getUserMedia' in navigator.mediaDevices);

export default Modernizr.getUserMedia
