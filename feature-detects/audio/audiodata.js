/*!
{
  "name": "Audio Data API",
  "property": "audiodata",
  "aliases": [],
  "polyfills": [{
    "name": "XAudioJS",
    "authors": ["Grant Galitz"],
    "href": "https://github.com/grantgalitz/XAudioJS",
    "licenses": [],
    "notes": [
      "Audio sample stream output thin-abstraction library that supports mono and stereo audio, as well as resampling the audio stream.",
      "Supports the Mozilla Audio Data API, Web Audio API, Adobe Flash 10, real-time WAV PCM Data URI generation"
    ]
  },{
    "name": "dynamicaudio.js",
    "authors": ["Ben Firshman"],
    "href": "http://github.com/bfirsh/dynamicaudio.js",
    "licenses": ["BSD"],
    "notes": []
  },{
    "name": "audiolib.js",
    "authors": ["Jussi Kalliokoski"],
    "href": "https://github.com/jussi-kalliokoski/audiolib.js",
    "licenses": ["MIT"],
    "notes": ["specs: incubator group proposed spec, Mozilla Audio Data API (temporary)"]
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
