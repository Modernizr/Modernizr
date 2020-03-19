/*!
{
  "name": "CSS :nth-child pseudo-selector",
  "caniuse": "css-sel3",
  "property": "nthchild",
  "tags": ["css"],
  "notes": [{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/pull/685"
  }, {
    "name": "Sitepoint :nth-child documentation",
    "href": "https://www.sitepoint.com/atoz-css-screencast-nth-child/"
  }],
  "authors": ["@emilchristensen"],
  "warnings": ["Known false negative in Safari 3.1 and Safari 3.2.2"]
}
!*/
/* DOC
Detects support for the ':nth-child()' CSS pseudo-selector.
*/
define(['Modernizr', 'testStyles'], function(Modernizr, testStyles) {
  // 4 `<div>` elements with `1px` width are created. Then every other element has its `width` set to `2px`.
  // Then we check if the width of the even elements is different then the width of the odd elements
  // while the two even elements have the same width (and the two odd elements too).
  // Earlier versions of the tests tried to check for the actual width which didnt work on chrome when the
  // browser was zoomed in our out in specific ways.
  testStyles('#modernizr div {width:1px} #modernizr div:nth-child(2n) {width:2px;}', function(elem) {
    var elems = elem.getElementsByTagName('div');
    var correctWidths = elems[0].offsetWidth === elems[2].offsetWidth &&
      elems[1].offsetWidth === elems[3].offsetWidth &&
      elems[0].offsetWidth !== elems[1].offsetWidth;
    Modernizr.addTest('nthchild', correctWidths);
  }, 4);
});
