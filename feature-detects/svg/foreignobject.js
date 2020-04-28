/*!
{
  "name": "SVG foreignObject",
  "property": "svgforeignobject",
  "tags": ["svg"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/SVG11/extend.html"
  }]
}
!*/
/* DOC
Detects support for foreignObject tag in SVG.
*/
import Modernizr from '../../src/Modernizr.js';
import toStringFn from '../../src/toStringFn.js';

Modernizr.addTest('svgforeignobject', function() {
  return !!document.createElementNS &&
    /SVGForeignObject/.test(toStringFn.call(document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')));
});

export default Modernizr.svgforeignobject
