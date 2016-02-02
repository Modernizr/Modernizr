/*!
{
  "name": "iframe[srcdoc] Attribute",
  "property": "srcdoc",
  "tags": ["iframe"],
  "builderAliases": ["iframe_srcdoc"],
  "notes": [{
    "name": "WhatWG Spec",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/the-iframe-element.html#attr-iframe-srcdoc"
  }]
}
!*/
/* DOC
Test for `srcdoc` attribute in iframes.
*/
/*!
{
  "name": "iframe[srcdoc] Attribute",
  "property": "srcdoc",
  "tags": ["iframe"],
  "builderAliases": ["iframe_srcdoc"],
  "notes": [{
    "name": "WhatWG Spec",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/the-iframe-element.html#attr-iframe-srcdoc"
  }]
}
!*/
/* DOC
Test for `srcdoc` attribute in iframes.
*/
import Modernizr from 'Modernizr';

import createElement from 'createElement';
Modernizr.addTest('srcdoc', 'srcdoc' in createElement('iframe'));