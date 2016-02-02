/*!
{
  "name": "XHR responseType='arraybuffer'",
  "property": "xhrresponsetypearraybuffer",
  "tags": ["network"],
  "notes": [{
    "name": "XMLHttpRequest Living Standard",
    "href": "http://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType='arraybuffer'.
*/
/*!
{
  "name": "XHR responseType='arraybuffer'",
  "property": "xhrresponsetypearraybuffer",
  "tags": ["network"],
  "notes": [{
    "name": "XMLHttpRequest Living Standard",
    "href": "http://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType='arraybuffer'.
*/
import Modernizr from 'Modernizr';

import testXhrType from 'testXhrType';
Modernizr.addTest('xhrresponsetypearraybuffer', testXhrType('arraybuffer'));