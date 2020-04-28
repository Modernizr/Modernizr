/*!
{
  "name": "Box Decoration Break",
  "property": "boxdecorationbreak",
  "caniuse": "css-boxdecorationbreak",
  "tags": ["css"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/box-decoration-break"
  }, {
    "name": "Demo",
    "href": "https://jsbin.com/xojoro/edit?css,output"
  }]
}
!*/
/* DOC
Specifies how an element's fragments should be rendered when broken across multiple lines, columns, or pages.
*/
import Modernizr from '../../src/Modernizr.js';
import testAllProps from '../../src/testAllProps.js';

Modernizr.addTest('boxdecorationbreak', testAllProps('boxDecorationBreak', 'slice'));

export default Modernizr.boxdecorationbreak
