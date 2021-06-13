/*!
{
  "name": "XHR responseType",
  "property": "xhrresponsetype",
  "tags": ["network"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('xhrresponsetype', (function() {
    if (typeof XMLHttpRequest === 'undefined') {
      return false;
    }
    
    var xhr = new XMLHttpRequest();
    try {
      // "xhr.open" may crash when used within an iframe
      xhr.open('get', '/', true);
      return 'response' in xhr;
    } catch (signal) {
      return false;
    };
  }()));
});
