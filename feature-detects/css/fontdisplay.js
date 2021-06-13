/*!
{
  "name": "Font Display",
  "property": "fontdisplay",
  "authors": ["Patrick Kettner"],
  "caniuse": "css-font-rendering-controls",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://drafts.csswg.org/css-fonts-4/#font-display-desc"
  }, {
    "name": "`font-display` for the masses",
    "href": "https://css-tricks.com/font-display-masses/"
  }]
}
!*/
/* DOC
Detects support for the `font-display` descriptor, which defines how font files are loaded and displayed by the browser.
*/
define(['Modernizr', 'testProp'], function(Modernizr, testProp) {
  Modernizr.addTest('fontDisplay', testProp('font-display'));
});
