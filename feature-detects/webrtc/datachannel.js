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
define(['Modernizr', 'prefixed', 'domPrefixes', 'test/webrtc/peerconnection'], function(Modernizr, prefixed, domPrefixes) {

  Modernizr.addTest('datachannel', function() {
    if (!Modernizr.peerconnection) {
      return false;
    }
    try {
      for (var i = 0, l = domPrefixes.length; i < l; i++) {
        var PeerConnectionConstructor = window[domPrefixes[i] + 'RTCPeerConnection'];

        if (PeerConnectionConstructor) {
          var peerConnection = new PeerConnectionConstructor(null);

          return 'createDataChannel' in peerConnection;
        }
      }
    } catch (e) {
      // Some SmartTVs throw this exception: "NotSupportedError: DOM Exception 9"
    }
    return false;
  });
});
