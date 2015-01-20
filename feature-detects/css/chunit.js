/*!
{
  "name": "CSS Font ch Units",
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "property": "csschunit",
  "tags": ["css"],
  "notes": [{
    "name": "W3C Spec",
    "href": "http://www.w3.org/TR/css3-values/#font-relative-lengths"
  }]
}
!*/
/* DOC
Detects support for the ch unit value. 1ch is equal to the width of the "0" glyph.

This feature detect is useful when using monospace fonts where all glyphs have the same width. For example:

If you have a poem that must be 40 characters wide for every line regardless of font-size.

```css
#poem {
 font-family: monospace;
 font-size: 100px;
 width: 40ch;
}
```
*/
define(['Modernizr', 'modElem'], function (Modernizr, modElem) {
  Modernizr.addTest('csschunit', function () {
    var elemStyle = modElem.elem.style;
    try {
      elemStyle.fontSize = '3ch';
    } catch (e) { }
    return elemStyle.fontSize.indexOf('ch') !== -1;
  });
});
