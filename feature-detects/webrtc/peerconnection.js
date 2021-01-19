/*!
{
  "name": "RTC Peer Connection",
  "property": "peerconnection",
  "caniuse": "rtcpeerconnection",
  "tags": ["webrtc"],
  "authors": ["Ankur Oberoi"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/webrtc/"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import prefixed from '../../src/prefixed.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('peerconnection', !!prefixed('RTCPeerConnection', _globalThis));

export default Modernizr.peerconnection
