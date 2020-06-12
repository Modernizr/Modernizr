/*!
{
  "name": "Clipboard API",
  "property": "clipboard",
  "tags": ["clipboard"],
  "authors": ["Markel Ferro (@MarkelFe)"],
  "async": true,
  "warnings": ["These tests currently require document.body to be present"],
  "notes": [{
    "name": "MDN Docs Clipboard Object",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard"
  }, {
    "name": "MDN Docs Clipboard API",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API"
  }]
}
!*/
/* DOC
It tests for the whole clipboard API. For sub-features check other tests
*/
define(['Modernizr', 'addTest'], function(Modernizr, addTest) {
  Modernizr.addAsyncTest(function() {
    var result;
    if (navigator.clipboard) {
      result = true;
    } else {
      result = false;
    }
    addTest('clipboard', result);
    return;
  });
});