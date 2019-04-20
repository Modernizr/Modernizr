/*!
{
  "name": "RTC Data Channel",
  "property": "datachannel",
  "notes": [{
    "name": "HTML5 Rocks Tutorial",
    "href": "https://www.html5rocks.com/en/tutorials/webrtc/datachannels/"
  }]
}
!*/
/* DOC
Detect for the RTCDataChannel API that allows for transfer data directly from one peer to another
*/
define(['Modernizr', 'prefixed', 'domPrefixesAll', 'test/webrtc/peerconnection'], function(Modernizr, prefixed, domPrefixesAll) {
  Modernizr.addTest('datachannel', function() {
    if (!Modernizr.peerconnection) {
      return false;
    }
    for (var i = 0, len = domPrefixesAll.length; i < len; i++) {
      var PeerConnectionConstructor = window[domPrefixesAll[i] + 'RTCPeerConnection'];
      if (PeerConnectionConstructor) {
        var peerConnection = new PeerConnectionConstructor(null);
        return 'createDataChannel' in peerConnection;
      }
    }
    return false;
  });
});
