/*!
{
  "name": "XHR responseType='document'",
  "property": "xhrresponsetypedocument",
  "tags": ["network"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType='document'.
*/
import Modernizr from '../../src/Modernizr.js';
import testXhrType from '../../src/testXhrType.js';

Modernizr.addTest('xhrresponsetypedocument', testXhrType('document'));

export default Modernizr.xhrresponsetypedocument
