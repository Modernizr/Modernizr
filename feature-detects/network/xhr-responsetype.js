/*!
{
  "name": "XHR responseType",
  "property": "xhrresponsetype",
  "tags": ["network"],
  "notes": [{
    "name": "XMLHttpRequest Living Standard",
    "href": "http://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType.
*/
import Modernizr from 'Modernizr';

Modernizr.addTest('xhrresponsetype', (function() {
  if (typeof XMLHttpRequest == 'undefined') {
    return false;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('get', '/', true);
  return 'response' in xhr;
}()));
