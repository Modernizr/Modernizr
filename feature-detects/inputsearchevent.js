/*!
{
  "name": "input[search] search event",
  "property": "inputsearchevent",
  "tags": ["input","search"],
  "authors": ["Calvin Webster"],
  "notes": [{
    "name": "Wufoo demo",
    "href": "https://www.wufoo.com/html5/search-type/"
  }, {
    "name": "CSS Tricks",
    "href": "https://css-tricks.com/webkit-html5-search-inputs/"
  }]
}
!*/
/* DOC
There is a custom `search` event implemented in webkit browsers when using an `input[search]` element.
*/
import Modernizr from '../src/Modernizr.js';
import hasEvent from '../src/hasEvent.js';

Modernizr.addTest('inputsearchevent', hasEvent('search'));

export default Modernizr.inputsearchevent
