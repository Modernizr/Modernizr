/*!
{
  "name": "time Element",
  "property": "time",
  "tags": ["elem"],
  "builderAliases": ["elem_time"],
  "notes": [{
    "name": "WhatWG Spec",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/text-level-semantics.html#the-time-element"
  }]
}
!*/
/*!
{
  "name": "time Element",
  "property": "time",
  "tags": ["elem"],
  "builderAliases": ["elem_time"],
  "notes": [{
    "name": "WhatWG Spec",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/text-level-semantics.html#the-time-element"
  }]
}
!*/
import Modernizr from 'Modernizr';

import createElement from 'createElement';
Modernizr.addTest('time', 'valueAsDate' in createElement('time'));