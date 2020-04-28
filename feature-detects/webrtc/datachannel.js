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
import Modernizr from '../../src/Modernizr.js';
import domPrefixesAll from '../../src/domPrefixesAll.js';
import peerConnectionSupported from './peerconnection.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('datachannel', function() {
  if (!peerConnectionSupported) {
    return false;
  }
  for (var i = 0, len = domPrefixesAll.length; i < len; i++) {
    var PeerConnectionConstructor = _globalThis[domPrefixesAll[i] + 'RTCPeerConnection'];
    if (PeerConnectionConstructor) {
      var peerConnection = new PeerConnectionConstructor(null);
      return 'createDataChannel' in peerConnection;
    }
  }
  return false;
});

export default Modernizr.datachannel
