/*!
{
  "name": "Background Size Cover",
  "property": "bgsizecover",
  "tags": ["css"],
  "builderAliases": ["css_backgroundsizecover"],
  "notes": [{
    "name" : "MDN Docs",
    "href": "http://developer.mozilla.org/en/CSS/background-size"
  }]
}
!*/
import Modernizr from 'Modernizr';

import testAllProps from 'testAllProps';
// Must test value, as this specifically tests the `cover` value
Modernizr.addTest('bgsizecover', testAllProps('backgroundSize', 'cover'));
