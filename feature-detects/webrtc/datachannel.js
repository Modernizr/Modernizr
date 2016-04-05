/*!
{
  "name": "RTC Data Channel",
  "property": "datachannel",
  "notes": [{
    "name": "HTML5 Rocks! Article",
    "href": "http://www.html5rocks.com/en/tutorials/webrtc/datachannels/"
  }]
}
!*/
/* DOC
Detect for the RTCDataChannel API that allows for transfer data directly from one peer to another
*/
define(['Modernizr', 'prefixed'], function(Modernizr, prefixed) {
  Modernizr.addTest('datachannel', function() {
    /* Return the property because otherwise we get a bound constructor. */
    var prop = prefixed('RTCPeerConnection', window, false);
    if (prop) {
      var peerConnection = new window[prop]({
        iceServers: [{url: 'stun:0'}],
      });
      return 'createDataChannel' in peerConnection;
    } else {
      return false;
    }
  });
});
