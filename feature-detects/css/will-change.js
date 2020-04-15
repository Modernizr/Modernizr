/*!
{
  "name": "will-change",
  "property": "willchange",
  "caniuse": "will-change",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://drafts.csswg.org/css-will-change/"
  }]
}
!*/
/* DOC
Detects support for the `will-change` css property, which formally signals to the
browser that an element will be animating.
*/
define(['Modernizr', 'docElement'], function(Modernizr, docElement) {
  Modernizr.addTest('willchange', 'willChange' in docElement.style);
});
