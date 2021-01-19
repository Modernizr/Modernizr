/*!
{
  "name": "Font Ligatures",
  "property": "ligatures",
  "caniuse": "font-feature",
  "notes": [{
    "name": "Cross-browser Web Fonts",
    "href": "https://www.sitepoint.com/cross-browser-web-fonts-part-3/"
  }]
}
!*/
/* DOC
Detects support for OpenType ligatures
*/
import Modernizr from '../src/Modernizr.js';
import testAllProps from '../src/testAllProps.js';

Modernizr.addTest('ligatures', testAllProps('fontFeatureSettings', '"liga" 1'));

export default Modernizr.ligatures
