/*!
{
  "name": "XHR responseType='json'",
  "property": "xhrresponsetypejson",
  "tags": ["network"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }, {
    "name": "Explanation of xhr.responseType='json'",
    "href": "https://mathiasbynens.be/notes/xhr-responsetype-json"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType='json'.
*/
import Modernizr from '../../src/Modernizr.js';
import testXhrType from '../../src/testXhrType.js';

Modernizr.addTest('xhrresponsetypejson', testXhrType('json'));

export default Modernizr.xhrresponsetypejson
