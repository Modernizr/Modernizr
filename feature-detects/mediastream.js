/*!
{
  "name": "MediaRecorder API",
  "property": "mediarecorder",
  "caniuse": "mediarecorder",
  "tags": ["mediarecorder"],
  "authors": ["Jaikishan Brijwani"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API"
  }]
}
!*/
/* DOC
Detects support for the MediaStream Recording API for detecting mediastreaming.
*/


define(['Modernizr'], function (Modernizr) {
    Modernizr.addTest('mediarecorder', typeof MediaRecorder !== undefined );
});