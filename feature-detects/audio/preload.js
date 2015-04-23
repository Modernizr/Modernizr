/*!
{
  "name": "Audio Preload Attribute",
  "property": "audiopreload",
  "tags": ["audio", "media"]
}
!*/
/* DOC
Detects if audio can be downloaded in the background before it starts playing in the `<audio>` element
*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  Modernizr.addTest('audiopreload', 'preload' in createElement('audio'));
});
