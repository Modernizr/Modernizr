/*!
{
  "name": "Hashchange event",
  "property": "hashchange",
  "caniuse": "hashchange",
  "tags": ["history"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onhashchange"
  }],
  "polyfills": [
    "jquery-hashchange",
    "moo-historymanager",
    "jquery-ajaxy",
    "hasher",
    "shistory"
  ]
}
!*/
/* DOC
Detects support for the `hashchange` event, fired when the current location fragment changes.
*/
import Modernizr from '../src/Modernizr.js';
import hasEvent from '../src/hasEvent.js';
import _globalThis from '../src/globalThis.js';
var doc = _globalThis.document;

Modernizr.addTest('hashchange', function() {
  if (hasEvent('hashchange', _globalThis) === false) {
    return false;
  }

  // documentMode logic from YUI to filter out IE8 Compat Mode
  //   which false positives.
  return (doc && (doc.documentMode === undefined || doc.documentMode > 7));
});

export default Modernizr.hashchange
