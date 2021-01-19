/*!
{
  "name": "CSS Filters",
  "property": "cssfilters",
  "caniuse": "css-filters",
  "polyfills": ["polyfilter"],
  "tags": ["css"],
  "builderAliases": ["css_filters"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/filter"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';
import prefixes from '../../src/prefixes.js';
import testAllProps from '../../src/testAllProps.js';
import supports from './supports.js';

Modernizr.addTest('cssfilters', function() {
  if (supports) {
    return testAllProps('filter', 'blur(2px)');
  } else {
    var el = createElement('a');
    el.style.cssText = prefixes.join('filter:blur(2px); ');
    // https://github.com/Modernizr/Modernizr/issues/615
    // documentMode is needed for false positives in oldIE, please see issue above
    return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
  }
});

export default Modernizr.cssfilters
