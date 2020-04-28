/*!
{
  "name": "XHR responseType='arraybuffer'",
  "property": "xhrresponsetypearraybuffer",
  "tags": ["network"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType='arraybuffer'.
*/
import Modernizr from '../../src/Modernizr.js';
import testXhrType from '../../src/testXhrType.js';

Modernizr.addTest('xhrresponsetypearraybuffer', testXhrType('arraybuffer'));

export default Modernizr.xhrresponsetypearraybuffer
