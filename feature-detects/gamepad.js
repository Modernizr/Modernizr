/*!
{
  "name": "GamePad API",
  "property": "gamepads",
  "caniuse": "gamepad",
  "authors": ["Eric Bidelman"],
  "tags": ["media"],
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
import Modernizr from '../src/Modernizr.js';
import prefixed from '../src/prefixed.js';
import _globalThis from '../src/globalThis.js';

Modernizr.addTest('gamepads', !!prefixed('getGamepads', _globalThis.navigator));

export default Modernizr.gamepads
