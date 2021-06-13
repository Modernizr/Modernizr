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
define(['Modernizr', 'prefixed'], function(Modernizr, prefixed) {
  Modernizr.addTest('peerconnection', !!prefixed('RTCPeerConnection', window));
});
