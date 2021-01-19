/*!
{
  "name": "CSS Transforms 3D",
  "property": "csstransforms3d",
  "caniuse": "transforms3d",
  "tags": ["css"],
  "knownBugs": [
    "Chrome may occasionally fail this test on some systems; more info: https://bugs.chromium.org/p/chromium/issues/detail?id=129004, however, the issue has since been closed (marked as fixed)."
  ]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import testAllProps from '../../src/testAllProps.js';
import './supports.js';

Modernizr.addTest('csstransforms3d', function() {
  return !!testAllProps('perspective', '1px', true);
});

export default Modernizr.csstransforms3d
