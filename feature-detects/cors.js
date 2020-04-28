/*!
{
  "name": "Cross-Origin Resource Sharing",
  "property": "cors",
  "caniuse": "cors",
  "authors": ["Theodoor van Donge"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS"
  }],
  "polyfills": ["pmxdr", "ppx", "flxhr"]
}
!*/
/* DOC
Detects support for Cross-Origin Resource Sharing: method of performing XMLHttpRequests across domains.
*/
import Modernizr from '../src/Modernizr.js';
import _globalThis from '../src/globalThis.js';

Modernizr.addTest('cors', 'XMLHttpRequest' in _globalThis && 'withCredentials' in new _globalThis.XMLHttpRequest());

export default Modernizr.cors;
