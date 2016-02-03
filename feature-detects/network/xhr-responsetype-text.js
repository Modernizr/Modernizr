/*!
{
  "name": "XHR responseType='text'",
  "property": "xhrresponsetypetext",
  "tags": ["network"],
  "notes": [{
    "name": "XMLHttpRequest Living Standard",
    "href": "http://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType='text'.
*/
import Modernizr from 'Modernizr';

import testXhrType from 'testXhrType';
Modernizr.addTest('xhrresponsetypetext', testXhrType('text'));
