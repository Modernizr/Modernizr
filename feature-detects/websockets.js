/*!
{
  "name": "WebSockets Support",
  "property": "websockets",
  "authors": ["Phread [fearphage]", "Mike Sherov [mikesherov]", "Burak Yigit Kaya [BYK]"],
  "caniuse": "websockets",
  "warnings": "This test will reject any old version of WebSockets even if it is not prefixed such as in Safari 5.1",
  "notes": "More info about the CLOSING state can be found at the spec: http://www.w3.org/TR/websockets/#the-websocket-interface",
  "tags": ["html5"],
  "polyfills": [{
    "name": "SockJS",
    "href": "https://github.com/sockjs/sockjs-client"
  },{
    "name": "socket.io",
    "href": "http://socket.io/"
  },{
    "name": "Kaazing WebSocket Gateway",
    "href": "http://kaazing.com/products/kaazing-websocket-gateway.html"
  },{
    "name": "web-socket-js",
    "href": "http://github.com/gimite/web-socket-js/"
  },{
    "name": "atmosphere jQuery plugin",
    "href": "http://jfarcand.wordpress.com/2010/06/15/using-atmospheres-jquery-plug-in-to-build-applicationsupporting-both-websocket-and-comet/"
  },{
    "name": "Graceful WebSocket jQuery plugin",
    "href": "https://github.com/ffdead/jquery-graceful-websocket"
  },{
    "name": "Portal",
    "href": "https://github.com/flowersinthesand/portal"
  },{
    "name": "DataChannel",
    "href": "https://github.com/piranna/DataChannel-polyfill"
  }]
}
!*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('websockets', 'WebSocket' in window && window.WebSocket.CLOSING === 2);
});
