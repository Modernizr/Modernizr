/*!
{
  "name": "XML HTTP Request Level 2 XHR2",
  "property": "xhr2",
  "caniuse": "xhr2",
  "tags": ["network"],
  "builderAliases": ["network_xhr2"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/XMLHttpRequest2/"
  }, {
    "name": "Details on Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/385"
  }]
}
!*/
/* DOC
Tests for XHR2.
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

// all three of these details report consistently across all target browsers:
//   !!(_globalThis.ProgressEvent);
//   'XMLHttpRequest' in _globalThis && 'withCredentials' in new XMLHttpRequest
Modernizr.addTest('xhr2', 'XMLHttpRequest' in _globalThis && 'withCredentials' in new _globalThis.XMLHttpRequest());

export default Modernizr.xhr2
