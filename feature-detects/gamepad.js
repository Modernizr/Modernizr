/*!
{
  "name": "GamePad API",
  "property": "gamepads",
  "authors": ["Eric Bidelman"],
  "tags": ["media"],
  "notes": [{
    "name": "W3C spec",
    "href": "http://www.w3.org/TR/gamepad/"
  },{
    "name": "HTML5 Rocks tutorial",
    "href": "http://www.html5rocks.com/en/tutorials/doodles/gamepad/#toc-featuredetect"
  }],
  "warnings": [],
  "polyfills": []
}
!*/
/* DOC

Detects support for the Gamepad API, for access to gamepads and controllers.

*/
define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // FF has Gamepad API support only in special builds, but not in any release (even behind a flag)
  // Their current implementation has no way to feature detect, only events to bind to, but a patch
  // will bring them up to date with the spec when it lands (and they'll pass this test)
  //   https://bugzilla.mozilla.org/show_bug.cgi?id=690935

  Modernizr.addTest('gamepads', !!prefixed('getGamepads', navigator));
});
