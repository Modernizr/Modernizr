/*!
{
  "name": "RTCPeerConnection Interface",
  "property": "peerconnection",
  "tags": ["rtc", "media"],
  "authors": ["Ankur Oberoi", "Matthew Robertson"],
  "notes": [{
    "name": "HTML5 Spec",
    "href": "http://dev.w3.org/2011/webrtc/editor/webrtc.html#rtcpeerconnection-interface"
  }]
}
!*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('peerconnection', !!(window.webkitRTCPeerConnection || window.RTCPeerConnection));
});
