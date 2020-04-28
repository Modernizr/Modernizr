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
import Modernizr from '../src/Modernizr.js';
import _globalThis from '../src/globalThis.js';

var result = {
  textencoder: 'TextEncoder' in _globalThis,
  textdecoder: 'TextDecoder' in _globalThis
}

Modernizr.addTest('textencoder', result.textencoder);
Modernizr.addTest('textdecoder', result.textdecoder);


export let textencoder = Modernizr.textencoder
export let textdecoder = Modernizr.textdecoder
export default result;
