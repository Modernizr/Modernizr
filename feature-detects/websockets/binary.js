/*!
{
  "name": "Binary WebSockets",
  "property": "websocketsbinary",
  "tags": ["websockets"],
  "builderAliases": ["websockets_binary"]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

// binaryType is truthy if there is support.. returns "blob" in new-ish chrome.
// plus.google.com/115535723976198353696/posts/ERN6zYozENV
// github.com/Modernizr/Modernizr/issues/370

Modernizr.addTest('websocketsbinary', function() {
  var protocol = 'https:' === location.protocol ? 'wss' : 'ws',
    protoBin;

  if ('WebSocket' in _globalThis) {
    protoBin = 'binaryType' in WebSocket.prototype;
    if (protoBin) {
      return protoBin;
    }
    try {
      return !!(new WebSocket(protocol + '://.').binaryType);
    } catch (e) {}
  }

  return false;
});

export default Modernizr.websocketsbinary
