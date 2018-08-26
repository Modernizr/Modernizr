/*!
{
  "name": "getUserMedia",
  "property": "getusermedia",
  "caniuse": "stream",
  "tags": ["webrtc"],
  "authors": ["Eric Bidelman", "Masataka Yakura"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://w3c.github.io/mediacapture-main/#dom-mediadevices-getusermedia"
  }]
}
!*/
/* DOC
Detects support for the new Promise-based `getUserMedia` API.
*/
define(['Modernizr'], function (Modernizr) {
  Modernizr.addTest('getUserMedia', 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices);
});
