/*!
{
  "name": "XHR responseType='blob'",
  "property": "xhrresponsetypeblob",
  "tags": ["network"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType='blob'.
*/
import Modernizr from '../../src/Modernizr.js';
import testXhrType from '../../src/testXhrType.js';

Modernizr.addTest('xhrresponsetypeblob', testXhrType('blob'));

export default Modernizr.xhrresponsetypeblob
