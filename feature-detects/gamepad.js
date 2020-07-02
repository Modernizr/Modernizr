/*!
{
  "name": "GamePad API",
  "property": "gamepads",
  "caniuse": "gamepad",
  "authors": ["Eric Bidelman"],
  "tags": ["media"],
  "warnings": ["In new browsers it may return false in non-HTTPS connections"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/gamepad/"
  }, {
    "name": "HTML5 Rocks Tutorial",
    "href": "https://www.html5rocks.com/en/tutorials/doodles/gamepad/#toc-featuredetect"
  }]
}
!*/
/* DOC
Detects support for the Gamepad API, for access to gamepads and controllers.
*/
define(['Modernizr', 'prefixed'], function(Modernizr, prefixed) {
  Modernizr.addTest('gamepads', !!prefixed('getGamepads', navigator));
});
