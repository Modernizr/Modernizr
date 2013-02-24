/*!
{
  "name": "Audio Data API",
  "property": "audiodata",
  "aliases": [],
  "polyfills": [{
    "name": "XAudioJS",
    "href": "https://github.com/grantgalitz/XAudioJS",
    "license": null,
    "notes": [
      "Audio sample stream output thin-abstraction library that supports mono and stereo audio, as well as resampling the audio stream.",
      "Supports the Mozilla Audio Data API, Web Audio API, Adobe Flash 10, real-time WAV PCM Data URI generation"
    ]
  }],
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
