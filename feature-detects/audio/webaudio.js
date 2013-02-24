/*!
{
  "name": "Web Audio API",
  "property": "webaudio",
  "aliases": [],
  "tags": ["audio", "media"],
  "knownBugs": [],
  "doc" : null,
  "authors": ["Addy Osmani"],
  "warnings": [],
  "notes": [{
    "name": "W3 Specification",
    "href": "https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html"
  }]
}
!*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('webaudio', !!(window.webkitAudioContext || window.AudioContext));
});
