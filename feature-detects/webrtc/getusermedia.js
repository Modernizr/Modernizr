/*!
{
  "name": "getUserMedia",
  "property": "getusermedia",
  "caniuse": "stream",
  "tags": ["webrtc"],
  "authors": ["Eric Bidelman"],
  "notes": [{
    "name": "W3C Media Capture and Streams spec",
    "href": "http://www.w3.org/TR/mediacapture-streams/"
  }],
  "polyfills": [
    "name": "getUserMedia.js",
    "href": "https://github.com/addyosmani/getUserMedia.js"
  ]
}
!*/
define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  Modernizr.addTest('getusermedia', !!prefixed('getUserMedia', navigator));
});
