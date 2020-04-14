/*!
{
  "name": "Background Repeat",
  "property": ["bgrepeatspace", "bgrepeatround"],
  "tags": ["css"],
  "builderAliases": ["css_backgroundrepeat"],
  "authors": ["Ryan Seddon"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat"
  }, {
    "name": "Test Page",
    "href": "https://jsbin.com/uzesun/"
  }, {
    "name": "Demo",
    "href": "https://jsfiddle.net/ryanseddon/yMLTQ/6/"
  }]
}
!*/
/* DOC
Detects the ability to use round and space as properties for background-repeat
*/
import Modernizr from '../../src/Modernizr.js';
import testAllProps from '../../src/testAllProps.js';

var css_backgroundrepeat = {
  bgrepeatround: testAllProps('backgroundRepeat', 'round'),
  bgrepeatspace: testAllProps('backgroundRepeat', 'space')
}

// Must value-test these
Modernizr.addTest('bgrepeatround', css_backgroundrepeat.bgrepeatround);
Modernizr.addTest('bgrepeatspace', css_backgroundrepeat.bgrepeatspace);

export default css_backgroundrepeat
