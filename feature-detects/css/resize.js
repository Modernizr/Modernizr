/*!
{
  "name": "CSS UI Resize",
  "property": "cssresize",
  "caniuse": "css-resize",
  "tags": ["css"],
  "builderAliases": ["css_resize"],
  "notes": [{
    "name": "W3C Specification",
    "href": "http://www.w3.org/TR/css3-ui/#resize"
  },{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/CSS/resize"
  }]
}
!*/
/* DOC
Test for CSS 3 UI "resize" property
*/
/*!
{
  "name": "CSS UI Resize",
  "property": "cssresize",
  "caniuse": "css-resize",
  "tags": ["css"],
  "builderAliases": ["css_resize"],
  "notes": [{
    "name": "W3C Specification",
    "href": "http://www.w3.org/TR/css3-ui/#resize"
  },{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/CSS/resize"
  }]
}
!*/
/* DOC
Test for CSS 3 UI "resize" property
*/
import Modernizr from 'Modernizr';

import testAllProps from 'testAllProps';
Modernizr.addTest('cssresize', testAllProps('resize', 'both', true));
