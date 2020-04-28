/*!
{
  "name": "SVG filters",
  "property": "svgfilters",
  "caniuse": "svg-filters",
  "tags": ["svg"],
  "builderAliases": ["svg_filters"],
  "authors": ["Erik Dahlstrom"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/SVG11/filters.html"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

// Should fail in Safari: https://stackoverflow.com/questions/9739955/feature-detecting-support-for-svg-filters.
Modernizr.addTest('svgfilters', function() {
  var result = false;
  try {
    result = 'SVGFEColorMatrixElement' in _globalThis &&
      SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE === 2;
  }
  catch (e) {}
  return result;
});

export default Modernizr.svgfilters
