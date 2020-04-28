/*!
{
  "name": "XHR responseType",
  "property": "xhrresponsetype",
  "tags": ["network"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType.
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('xhrresponsetype', (function() {
  if (typeof _globalThis.XMLHttpRequest === 'undefined') {
    return false;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('get', '/', true);
  return 'response' in xhr;
}()));

export default Modernizr.xhrresponsetype
