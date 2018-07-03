/*!
{
  "name": "WebSockets Support",
  "property": "websockets",
  "authors": ["Phread (@fearphage)", "Mike Sherov (@mikesherov)", "Burak Yigit Kaya (@BYK)"],
  "caniuse": "websockets",
  "tags": ["html5"],
  "warnings": [
    "This test will reject any old version of WebSockets even if it is not prefixed such as in Safari 5.1"
  ],
  "notes": [{
    "name": "CLOSING State and Spec",
    "href": "https://www.w3.org/TR/websockets/#the-websocket-interface"
  }],
  "polyfills": [
    "sockjs",
    "socketio",
    "kaazing-websocket-gateway",
    "websocketjs",
    "atmosphere",
    "graceful-websocket",
    "portal",
    "datachannel"
  ]
}
!*/
define(['Modernizr'], function(Modernizr) {
  var supports = false;
  try {
    supports = 'WebSocket' in window && window.WebSocket.CLOSING === 2;
  } catch (e) {}
  Modernizr.addTest('websockets', supports);
});
