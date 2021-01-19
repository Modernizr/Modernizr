/*!
{
  "name": "CSS vw unit",
  "property": "cssvwunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vwunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  }, {
    "name": "JSFiddle Example",
    "href": "https://jsfiddle.net/FWeinb/etnYC/"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import testStyles from '../../src/testStyles.js';
import computedStyle from '../../src/computedStyle.js';
import roundedEquals from '../../src/roundedEquals.js';
import _globalThis from '../../src/globalThis.js';

testStyles('#modernizr { width: 50vw; }', function(elem) {
  var width = parseInt(_globalThis.innerWidth / 2, 10);
  var compStyle = parseInt(computedStyle(elem, null, 'width'), 10);

  Modernizr.addTest('cssvwunit', roundedEquals(compStyle, width));
});

export default Modernizr.cssvwunit
