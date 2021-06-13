/*!
{
  "name": "output Element",
  "property": "outputelem",
  "tags": ["elem"],
  "builderAliases": ["elem_output"],
  "notes": [{
    "name": "WhatWG Spec",
    "href": "https://html.spec.whatwg.org/multipage/form-elements.html#the-output-element"
  }]
}
!*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  Modernizr.addTest('outputelem', 'value' in createElement('output'));
});
