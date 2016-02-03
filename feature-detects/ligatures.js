/*!
{
  "name": "Font Ligatures",
  "property": "ligatures",
  "caniuse": "font-feature",
  "notes": [{
    "name": "Cross-browser Web Fonts",
    "href": "http://www.sitepoint.com/cross-browser-web-fonts-part-3/"
  }]
}
!*/
/* DOC
Detects support for OpenType ligatures
*/
import Modernizr from 'Modernizr';

import testAllProps from 'testAllProps';
Modernizr.addTest('ligatures', testAllProps('fontFeatureSettings', '"liga" 1'));
