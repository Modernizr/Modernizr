/*!
{
  "name": "Audio Preload Attribute",
  "property": "audiopreload",
  "tags": ["audio", "media"]
}
!*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
    Modernizr.addTest('audiopreload', 'preload' in createElement('audio'));
});
