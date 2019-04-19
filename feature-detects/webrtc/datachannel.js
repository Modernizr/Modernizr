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
define(['Modernizr', 'prefixed', 'domPrefixes', 'test/webrtc/peerconnection'], function(Modernizr, prefixed, domPrefixes) {
  Modernizr.addTest('datachannel', function() {
    if (!Modernizr.peerconnection) {
      return false;
    }
    var prefixes = [''].concat(domPrefixes);
    for (var i = 0, l = prefixes.length; i < l; i++) {
      var PeerConnectionConstructor = window[prefixes[i] + 'RTCPeerConnection'];

      if (PeerConnectionConstructor) {
        var peerConnection = new PeerConnectionConstructor(null);

        return 'createDataChannel' in peerConnection;
      }

    }
    return false;
  });
});
