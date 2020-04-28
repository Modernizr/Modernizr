/*!
{
  "name": "XHR responseType='text'",
  "property": "xhrresponsetypetext",
  "tags": ["network"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType='text'.
*/
import Modernizr from '../../src/Modernizr.js';
import testXhrType from '../../src/testXhrType.js';

Modernizr.addTest('xhrresponsetypetext', testXhrType('text'));

export default Modernizr.xhrresponsetypetext
