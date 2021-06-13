/*!
{
  "name": "Video crossOrigin",
  "property": "videocrossorigin",
  "caniuse": "cors",
  "authors": ["Florian Mailliet"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes"
  }]
}
!*/
/* DOC
Detects support for the crossOrigin attribute on video tag
*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  Modernizr.addTest('videocrossorigin', 'crossOrigin' in createElement('video'));
});
