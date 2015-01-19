/*!
{
  "name": "CSS Font ex Units",
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "property": "cssexunit",
  "tags": ["css"],
  "notes": [{
    "name": "W3C Spec",
    "href": "http://www.w3.org/TR/css3-values/#font-relative-lengths"
  }]
}
!*/
/* DOC
Detects support for the ex CSS unit length.

`1ex` represents the x-height of the selected elements font, which on average is about 0.5em on 1em font.
*/
define(['Modernizr', 'modElem'], function (Modernizr, modElem) {
  Modernizr.addTest('cssexunit', function () {
    var elemStyle = modElem.elem.style;
    try {
      elemStyle.fontSize = '3ex';
    } catch (e) { }
    return elemStyle.fontSize.indexOf('ex') !== -1;
  });
});
