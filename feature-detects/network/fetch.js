/*!
{
  "name": "Fetch API",
  "property": "fetch",
  "tags": ["network"],
  "caniuse": "fetch",
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://fetch.spec.whatwg.org/"
  }],
  "polyfills": ["fetch"]
}
!*/
/* DOC
Detects support for the fetch API, a modern replacement for XMLHttpRequest.
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('fetch', 'fetch' in _globalThis);

export default Modernizr.fetch
