/*!
{
  "name": "CSS Filters",
  "property": "cssfilters",
  "caniuse": "css-filters",
  "polyfills": ["polyfilter"],
  "tags": ["css"],
  "builderAliases": ["css_filters"]
}
!*/
define(['Modernizr', 'setCss', 'createElement', 'prefixes'], function( Modernizr, setCss, createElement, prefixes ) {
  // https://github.com/Modernizr/Modernizr/issues/615
  // documentMode is needed for false positives in oldIE, please see issue above
  Modernizr.addTest('cssfilters', function() {
    var el = createElement('div');
    setCss(el, prefixes.join('filter:blur(2px); '));
    return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
  });

});
