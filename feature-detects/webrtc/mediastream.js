/*!
{
  "name": "MediaStream Recording API",
  "property": "mediarecorder",
  "caniuse": "mediarecorder",
  "tags": ["mediarecorder", "media"],
  "authors": ["Onkar Dahale"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API"
  }]
}
!*/
/* DOC
Detects support for the MediaStream Recording API.
*/
define(['Modernizr'], function (Modernizr) {
    Modernizr.addTest('mediastream', typeof MediaRecorder !== "undefined" );
});
