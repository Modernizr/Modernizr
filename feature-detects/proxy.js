/*!
{
  "name": "Proxy Object",
  "property": "proxy",
  "caniuse": "proxy",
  "authors": ["Brock Beaudry"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy"
  }],
  "polyfills": [
    "harmony-reflect"
  ]
}
!*/
/* DOC
Detects support for the Proxy object which is used to create dynamic proxies.
*/
import Modernizr from '../src/Modernizr.js';
import _globalThis from '../src/globalThis.js';

Modernizr.addTest('proxy', 'Proxy' in _globalThis);

export default Modernizr.proxy
