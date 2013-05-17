/*!
{
  "name": "Audio Data API",
  "property": "audiodata",
  "polyfills": ["xaudiojs", "dynamicaudiojs", "audiolibjs"],
  "tags": ["audio", "media"],
  "authors": ["Addy Osmani"],
  "notes": [{
    "name": "API Documentation",
    "href": "https://wiki.mozilla.org/Audio_Data_API"
  }]
}
!*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('audiodata', !!window.Audio);
});
