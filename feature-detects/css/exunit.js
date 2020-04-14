/*!
{
  "name": "CSS Font ex Units",
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "property": "cssexunit",
  "caniuse": "mdn-css_types_length_ex",
  "tags": ["css"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/css3-values/#font-relative-lengths"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import testStyles from '../../src/testStyles.js';
import computedStyle from '../../src/computedStyle.js';

testStyles('#modernizr { fontSize: 3ex }', function(elem) {
  var compStyle = computedStyle(elem, null, 'fontSize');

  Modernizr.addTest('csschunit', compStyle.indexOf('ex') !== -1);
});

export default Modernizr.cssexunit
