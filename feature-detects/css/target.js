/*!
{
  "name": "CSS :target pseudo-class",
  "caniuse": "css-sel3",
  "property": "target",
  "tags": ["css"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/:target"
  }],
  "authors": ["@zachleat"],
  "warnings": ["Opera Mini supports :target but doesn't update the hash for anchor links."]
}
!*/
/* DOC
Detects support for the ':target' CSS pseudo-class.
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

// querySelector
Modernizr.addTest('target', function() {
  var doc = _globalThis.document;
  if (!('querySelectorAll' in doc)) {
    return false;
  }

  try {
    doc.querySelectorAll(':target');
    return true;
  } catch (e) {
    return false;
  }
});

export default Modernizr.target
