/*!
{
  "name": "CSS text-align-last",
  "property": "textalignlast",
  "caniuse": "css-text-align-last",
  "tags": ["css"],
  "warnings": ["IE does not support the 'start' or 'end' values."],
  "notes": [{
    "name": "Quirksmode",
    "href": "https://www.quirksmode.org/css/text/textalignlast.html"
  }, {
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/text-align-last"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import testAllProps from '../../src/testAllProps.js';

Modernizr.addTest('textalignlast', testAllProps('textAlignLast'));

export default Modernizr.textalignlast
