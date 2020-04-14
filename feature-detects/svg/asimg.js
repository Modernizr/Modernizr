/*!
{
  "name": "SVG as an <img> tag source",
  "property": "svgasimg",
  "caniuse": "svg-img",
  "tags": ["svg"],
  "aliases": ["svgincss"],
  "authors": ["Chris Coyier"],
  "notes": [{
    "name": "HTML5 Spec",
    "href": "https://www.w3.org/TR/html5/embedded-content-0.html#the-img-element"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import isBrowser from '../../src/isBrowser.js';

// Original Async test by Stu Cox
// https://gist.github.com/chriscoyier/8774501

// Now a Sync test based on good results here
// https://codepen.io/chriscoyier/pen/bADFx

// Note http://www.w3.org/TR/SVG11/feature#Image is *supposed* to represent
// support for the `<image>` tag in SVG, not an SVG file linked from an `<img>`
// tag in HTML – but it’s a heuristic which works
Modernizr.addTest('svgasimg', isBrowser && document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'));

export default Modernizr.svgasimg
