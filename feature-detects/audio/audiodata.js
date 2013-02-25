/*!
{
  "name": "Audio Data API",
  "property": "audiodata",
  "aliases": [],
  "polyfills": ["xaudiojs", "dynamicaudiojs", "audiolibjs"],
  "tags": ["audio", "media"],
  "knownBugs": [],
  "doc" : null,
  "authors": ["Addy Osmani"],
  "warnings" : [],
  "notes": [{
    "name": "API Documentation",
    "href": "https://wiki.mozilla.org/Audio_Data_API"
  }]
}
!*/
define(['Modernizr'], function( Modernizr ) {
  // Mozilla Audio Data API
  Modernizr.addTest('audiodata', !!window.Audio);
});
