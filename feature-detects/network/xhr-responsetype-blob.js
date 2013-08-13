/*!
{
  "name": "XMLHttpRequest xhr.responseType='blob'",
  "property": "xhrresponsetypeblob",
  "tags": ["network"],
  "notes": [{
    "name": "XMLHttpRequest Living Standard",
    "href": "http://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC

Tests for XMLHttpRequest xhr.responseType='blob'.

*/
define(['Modernizr', 'testXhrType'], function( Modernizr, testXhrType ) {
  Modernizr.addTest('xhrresponsetypeblob', testXhrType('blob'));
});
