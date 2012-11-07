define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // getUserMedia
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/video-conferencing-and-peer-to-peer-communication.html
  // By Eric Bidelman

  Modernizr.addTest('getusermedia', !!prefixed('getUserMedia', navigator));
});
