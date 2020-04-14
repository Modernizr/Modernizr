/*!
{
  "name": "Context menus",
  "property": "contextmenu",
  "caniuse": "menu",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/html5/interactive-elements.html#context-menus"
  }, {
    "name": "thewebrocks.com Demo",
    "href": "http://thewebrocks.com/demos/context-menu/"
  }],
  "polyfills": ["jquery-contextmenu"]
}
!*/
/* DOC
Detects support for custom context menus.
*/
import Modernizr from '../src/Modernizr.js';
import docElement from '../src/docElement.js';
import _globalThis from '../src/globalThis.js';

Modernizr.addTest(
  'contextmenu', ('contextMenu' in docElement && 'HTMLMenuItemElement' in _globalThis)
);

export default Modernizr.contextmenu;
