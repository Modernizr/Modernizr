/*!
{
  "name": "matchMedia",
  "property": "matchmedia",
  "caniuse": "matchmedia",
  "tags": ["matchmedia"],
  "authors": ["Alberto Elias"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://drafts.csswg.org/cssom-view/#the-mediaquerylist-interface"
  }, {
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Window.matchMedia"
  }],
  "polyfills": ["matchmediajs"]
}
!*/
/* DOC
Detects support for matchMedia.
*/
import Modernizr from '../../src/Modernizr.js';
import prefixed from '../../src/prefixed.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('matchmedia', !!prefixed('matchMedia', _globalThis));

export default Modernizr.matchmedia
