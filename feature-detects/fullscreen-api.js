/*!
{
  "name": "Fullscreen API",
  "property": "fullscreen",
  "caniuse": "fullscreen",
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/API/Fullscreen"
  }],
  "polyfills": ["screenfulljs"],
  "builderAliases": ["fullscreen_api"]
}
!*/
/* DOC
Detects support for the ability to make the current website take over the user's entire screen
*/
import Modernizr from '../src/Modernizr.js';
import prefixed from '../src/prefixed.js';
import isBrowser from '../src/isBrowser.js';

// github.com/Modernizr/Modernizr/issues/739
Modernizr.addTest('fullscreen', isBrowser && !!(prefixed('exitFullscreen', document, false) || prefixed('cancelFullScreen', document, false)));

export default Modernizr.fullscreen
