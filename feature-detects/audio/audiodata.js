/*!
{
  "name": "Audio Data API",
  "property": "audiodata",
  "aliases": [],
  "tags": ["audio", "media"],
  "knownBugs": [],
  "doc" : null,
  "authors": ["Addy Osmani"],
  "references": [{
    "name": "API Documentation",
    "href": "https://wiki.mozilla.org/Audio_Data_API"
  }]
}
!*/
define(['Modernizr'], function( Modernizr ) {
  // Mozilla Audio Data API
  Modernizr.addTest('audiodata', !!window.Audio);
});
