define(['Modernizr'], function( Modernizr ) {
  /*
  Custom protocol handler support
  http://developers.whatwg.org/timers.html#custom-handlers
  Added by @benschwarz
  */
  Modernizr.addTest('customprotocolhandler', !!navigator.registerProtocolHandler);
});
