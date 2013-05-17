/*!
{
  "name": "time Element",
  "caniuse": "html5semantic",
  "property": "time",
  "tags": ["elem"],
  "notes": [{
    "name": "WhatWG Spec",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/rendering.html#the-time-element-0"
  }]
}
!*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('time', 'valueAsDate' in createElement('time'));
});
