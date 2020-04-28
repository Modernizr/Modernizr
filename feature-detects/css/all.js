
/*!
{
  "name": "cssall",
  "property": "cssall",
  "notes": [{
    "name": "Spec",
    "href": "https://drafts.csswg.org/css-cascade/#all-shorthand"
  }]
}
!*/
/* DOC
Detects support for the `all` css property, which is a shorthand to reset all css properties (except direction and unicode-bidi) to their original value
*/

import Modernizr from '../../src/Modernizr.js';
import docElement from '../../src/docElement.js';
import isBrowser from '../../src/isBrowser.js';

Modernizr.addTest('cssall', isBrowser && 'all' in docElement.style);
export default Modernizr.cssall;
