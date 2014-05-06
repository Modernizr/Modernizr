/*!
{
  "name": "CSS Cubic Bezier Range",
  "property": "cubicbezierrange",
  "tags": ["css"],
  "builderAliases": ["css_cubicbezierrange"],
  "doc" : null,
  "authors": ["@calvein"],
  "notes": [{
    "name": "MDN page on the <timing-function> data type",
    "href": "https://developer.mozilla.org/en/docs/Web/CSS/timing-function"
  }],
  "warnings": ["cubic-bezier values can't be > 1 for Webkit until [bug #45761](https://bugs.webkit.org/show_bug.cgi?id=45761) is fixed"]
}
!*/
/* DOC
Detects support for the CSS `cubic-bezier()` function, often used in conjunction with the `animation-timing-function` and `transition-timing-function` CSS properties.
*/
define(['Modernizr', 'createElement', 'prefixes'], function( Modernizr, createElement, prefixes ) {
  Modernizr.addTest('cubicbezierrange', function() {
    var el = createElement('div');
    el.style.cssText = prefixes.join('transition-timing-function:cubic-bezier(1,0,0,1.1); ');
    return !!el.style.length;
  });
});
