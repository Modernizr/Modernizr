/*!
{
  "name": "input[search] search event",
  "property": "inputsearchevent",
  "caniuse": "input-search",
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
define(['Modernizr', 'hasEvent'], function(Modernizr, hasEvent) {
  Modernizr.addTest('inputsearchevent', hasEvent('search'));
});
