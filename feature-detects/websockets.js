/*!
{
  "name": "WebSockets Support",
  "property": "websockets",
  "authors": ["Phread [fearphage]", "Mike Sherov [mikesherov]", "Burak Yigit Kaya [BYK]"],
  "caniuse": "websockets",
  "warnings": "This test will reject any old version of WebSockets even if it is not prefixed such as in Safari 5.1",
  "notes": "More info about the CLOSING state can be found at the spec: http://www.w3.org/TR/websockets/#the-websocket-interface",
  "tags": ["html5"]
}
!*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('websockets', 'WebSocket' in window && window.WebSocket.CLOSING === 2);
});
