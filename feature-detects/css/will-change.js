/*!
{
  "name": "will-change",
  "property": "willchange",
  "caniuse": "will-change",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://drafts.csswg.org/css-will-change/"
  }]
}
!*/
/* DOC
Detects support for the `will-change` css property, which formally signals to the
browser that an element will be animating.
*/
import Modernizr from '../../src/Modernizr.js';
import docElement from '../../src/docElement.js';
import isBrowser from '../../src/isBrowser.js';

Modernizr.addTest('willchange', isBrowser && 'willChange' in docElement.style);

export default Modernizr.willchange
