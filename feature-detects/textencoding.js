/*!
{
  "name": "Text Encoding/Decoding",
  "property": ["textencoder", "textdecoder"],
  "caniuse" : "textencoder",
  "notes": [{
    "name": "MDN TextEncoder Doc",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder"
  }, {
    "name": "MDN TextDecoder Doc",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder"
  }],
  "authors": ["dabretin"]
}
!*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('textencoder', !!(window.TextEncoder && window.TextEncoder.prototype.encode));
  Modernizr.addTest('textdecoder', !!(window.TextDecoder && window.TextDecoder.prototype.decode));
});
