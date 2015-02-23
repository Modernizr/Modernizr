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
define(['Modernizr', 'setCss', 'createElement', 'prefixes'], function( Modernizr, setCss, createElement, prefixes ) {
  Modernizr.addTest('cubicbezierrange', function() {
    var el = createElement('div');
    setCss(el, prefixes.join('transition-timing-function:cubic-bezier(1,0,0,1.1); '));
    return !!el.style.length;
  });
});
