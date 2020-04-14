/*!
{
  "name": "CSS textshadow",
  "property": "textshadow",
  "caniuse": "css-textshadow",
  "tags": ["css"],
  "knownBugs": ["FF3.0 will false positive on this test"]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import testProp from '../../src/testProp.js';

Modernizr.addTest('textshadow', testProp('textShadow', '1px 1px'));

export default Modernizr.textshadow
