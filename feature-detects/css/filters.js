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
    if (Modernizr.supports) {
      var len = prefixes.length;
      var prop = 'filter';
      var supports;

      for (var i = 0; i < len; i++) {
        var prefixProp = prefixes[i] + prop;
        supports = 'CSS' in window ?
          window.CSS.supports(prefixProp, 'blur(2px)') :
          window.supportsCSS(prefixProp, 'blur(2px)');

        if (supports) {
          break;
        }
      }

      return supports;
    } else {
      var el = createElement('div');
      el.style.cssText = prefixes.join('filter:blur(2px); ');
      return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
    }
  });

});
