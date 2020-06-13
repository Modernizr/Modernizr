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
    // var name;
    // var props = ['read', 'readText', 'write', 'writeText'];
    if (navigator.clipboard) {
      addTest('clipboard', true);
      /*
      // The sub-modules checked only if API is available to avoid Edge crashes
      for (var i = 0; i < props.length; i++) {
        if (navigator.clipboard[props[i]]) {
            result = true;
        } else {
            result = false;
        }
        name = props[i].toLowerCase();
        Modernizr.addTest('clipboard.' + name, result);
      }
      */

      // A work around while I complete the clean version
      if (navigator.clipboard.read) {
        result = true;
      } else {
        result = false;
      }
      addTest('clipboard.read', result);

      if (navigator.clipboard.readText) {
        result = true;
      } else {
        result = false;
      }
      addTest('clipboard.readText', result);

      if (navigator.clipboard.write) {
        result = true;
      } else {
        result = false;
      }
      addTest('clipboard.write', result);

      if (navigator.clipboard.writeText) {
        result = true;
      } else {
        result = false;
      }
      addTest('clipboard.writeText', result);
    }
    else {
      addTest('clipboard', false);
    }
  });
});