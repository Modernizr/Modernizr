/*!
{
  "name": "XHR responseType='document'",
  "property": "xhrresponsetypedocument",
  "tags": ["network"],
  "notes": [{
    "name": "XMLHttpRequest Living Standard",
    "href": "http://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType='document'.
*/
import Modernizr from 'Modernizr';

import testXhrType from 'testXhrType';
Modernizr.addTest('xhrresponsetypedocument', testXhrType('document'));
