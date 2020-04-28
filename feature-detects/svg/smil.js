/*!
{
  "name": "SVG SMIL animation",
  "property": "smil",
  "caniuse": "svg-smil",
  "tags": ["svg"],
  "notes": [{
  "name": "W3C Spec",
  "href": "https://www.w3.org/AudioVideo/"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import toStringFn from '../../src/toStringFn.js';

// SVG SMIL animation
Modernizr.addTest('smil', function() {
  return !!document.createElementNS &&
    /SVGAnimate/.test(toStringFn.call(document.createElementNS('http://www.w3.org/2000/svg', 'animate')));
});

export default Modernizr.smil
