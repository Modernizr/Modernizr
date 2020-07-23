/*!
{
  "name": "Clipboard API",
  "property": "clipboard",
  "tags": ["clipboard"],
  "authors": ["Markel Ferro (@MarkelFe)"],
  "async": true,
  "warnings": ["It may return false in non-HTTPS connections as the API is only available in secure contexts"],
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
It tests for the whole clipboard API. The sub-properties `read`, `readText`, `write` and `writeText` are supported. Note: This test does not detect the [clipboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/ClipboardEvent).

```javascript
Modernizr.clipboard         // Supports the clipboard API
Modernizr.clipboard.read    // Supports the read sub-property
```
*/
define(['Modernizr', 'addTest'], function(Modernizr, addTest) {
  Modernizr.addAsyncTest(function() {
    var result;
    var props = ['read', 'readText', 'write', 'writeText'];
    if (navigator.clipboard) {
      addTest('clipboard', true);
      // The sub-modules checked only if API is available to avoid Edge crashes
      for (var i = 0; i < props.length; i++) {
        if (navigator.clipboard[props[i]]) {
          result = true;
        } else {
          result = false;
        }
        addTest('clipboard.' + props[i].toLowerCase(), result);
      }
    }
    else {
      addTest('clipboard', false);
    }
  });
});