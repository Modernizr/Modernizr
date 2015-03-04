/*!
{
  "name": "CSS Filters",
  "property": "cssfilters",
  "caniuse": "css-filters",
  "polyfills": ["polyfilter"],
  "tags": ["css"],
  "builderAliases": ["css_filters"],
  "notes": [{
    "name": "MDN article on CSS filters",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/filter"
  }]
}
!*/
define(['Modernizr', 'createElement', 'prefixes', 'test/css/supports'], function( Modernizr, createElement, prefixes ) {
  // https://github.com/Modernizr/Modernizr/issues/615
  // documentMode is needed for false positives in oldIE, please see issue above
  Modernizr.addTest('cssfilters', function() {
    var el = createElement('div');
    el.style.cssText = prefixes.join('filter:blur(2px); ');
    if (Modernizr.supports) {
      var supports = 'CSS' in window ?
        window.CSS.supports('filter', 'url()') :
        window.supportsCSS('filter', 'url()');

      // older firefox only supports `url` filters;
      return supports;
    } else {
      return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
    }
  });

});
