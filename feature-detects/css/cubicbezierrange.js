/*!
{
  "name": "CSS Cubic Bezier Range",
  "property": "cubicbezierrange",
  "tags": ["css"],
  "builderAliases": ["css_cubicbezierrange"],
  "authors": ["@calvein"],
  "warnings": ["In old versions (pre-2013) cubic-bezier values can't be > 1 due to Webkit [bug #45761](https://bugs.webkit.org/show_bug.cgi?id=45761)"],
  "notes": [{
    "name": "Comprehensive Compat Chart",
    "href": "https://muddledramblings.com/table-of-css3-border-radius-compliance/"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';
import prefixes from '../../src/prefixes.js';

Modernizr.addTest('cubicbezierrange', function() {
  var el = createElement('a');
  el.style.cssText = prefixes.join('transition-timing-function:cubic-bezier(1,0,0,1.1); ');
  return !!el.style.length;
});

export default Modernizr.cubicbezierrange
