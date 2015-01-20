/*!
{
  "name": "CSS Cubic Bezier Range",
  "property": "cubicbezierrange",
  "tags": ["css"],
  "builderAliases": ["css_cubicbezierrange"],
  "doc" : null,
  "authors": ["@calvein"],
  "warnings": ["cubic-bezier values can't be > 1 for Webkit until [bug #45761](https://bugs.webkit.org/show_bug.cgi?id=45761) is fixed"]
}
!*/
/* DOC
Detects support for the cubic-bezier timing function that can be used with CSS transitions or animations.
*/
define(['Modernizr', 'createElement', 'prefixes'], function( Modernizr, createElement, prefixes ) {
  Modernizr.addTest('cubicbezierrange', function() {
    var el = createElement('div');
    el.style.cssText = prefixes.join('transition-timing-function:cubic-bezier(1,0,0,1.1); ');
    return !!el.style.length;
  });
});
