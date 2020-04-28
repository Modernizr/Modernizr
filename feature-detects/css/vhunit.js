/*!
{
  "name": "CSS vh unit",
  "property": "cssvhunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vhunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  }, {
    "name": "Similar JSFiddle",
    "href": "https://jsfiddle.net/FWeinb/etnYC/"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import testStyles from '../../src/testStyles.js';
import computedStyle from '../../src/computedStyle.js';

testStyles('#modernizr { height: 50vh; max-height: 10px; }', function(elem) {
  var compStyle = parseInt(computedStyle(elem, null, 'height'), 10);
  Modernizr.addTest('cssvhunit', compStyle === 10);
});

export default Modernizr.cssvhunit
