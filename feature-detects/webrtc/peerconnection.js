/*!
{
  "name": "RTC Peer Connection",
  "property": "peerconnection",
  "tags": ["webrtc"],
  "authors": ["Ankur Oberoi"],
  "notes": [{
    "name": "W3C Web RTC spec",
    "href": "http://www.w3.org/TR/webrtc/"
  }]
}
!*/
import Modernizr from 'Modernizr';

import prefixed from 'prefixed';
Modernizr.addTest('peerconnection', !!prefixed('RTCPeerConnection', window));
