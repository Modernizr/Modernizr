/*!
{
  "name": "Custom protocol handler",
  "property": "customprotocolhandler",
  "authors": ["Ben Schwarz"],
  "notes": [{
    "name": "WHATWG overview",
    "href": "http://developers.whatwg.org/timers.html#custom-handlers"
  },{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/navigator.registerProtocolHandler"
  }],
  "warnings": [],
  "polyfills": []
}
!*/
/* DOC

Detects support for the `window.registerProtocolHandler()` API to allow web sites to register themselves as possible handlers for particular protocols.

*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('customprotocolhandler', !!navigator.registerProtocolHandler);
});
