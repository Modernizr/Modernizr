/*!
{
  "name": "Audio Loop Attribute",
  "property": "audioloop",
  "tags": ["audio", "media"]
}
!*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
    Modernizr.addTest('audioloop', 'loop' in createElement('audio'));
});
