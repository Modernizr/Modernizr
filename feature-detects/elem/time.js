/*!
{
  "name": "time Element",
  "property": "time",
  "tags": ["elem"],
  "notes": [{
    "name": "WhatWG Spec",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/text-level-semantics.html#the-time-element"
  }]
}
!*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('time', 'valueAsDate' in createElement('time'));
});
