/*!
{
  "name": "Base 64 encoding/decoding",
  "property": "atobbtoa",
  "builderAliases": ["atob-btoa"],
  "caniuse": "atob-btoa",
  "tags": ["atob", "base64", "WindowBase64", "btoa"],
  "authors": ["Christian Ulbrich"],
  "notes": [{
    "name": "WindowBase64",
    "href": "https://www.w3.org/TR/html5/webappapis.html#windowbase64"
  }, {
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob"
  }],
  "polyfills": ["base64js"]
}
!*/
/* DOC
Detects support for WindowBase64 API (_globalThis.atob && _globalThis.btoa).
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('atobbtoa', 'atob' in _globalThis && 'btoa' in _globalThis, {
  aliases: ['atob-btoa']
});

export default Modernizr.atobbtoa
