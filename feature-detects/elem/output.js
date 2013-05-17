/*!
{
  "name": "output Element",
  "property": "outputelem",
  "tags": ["elem"],
  "notes": [{
    "name": "WhatWG Spec",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/the-button-element.html#the-output-element"
  }]
}
!*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('outputelem', 'value' in createElement('output'));
});
