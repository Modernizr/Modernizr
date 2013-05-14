/*!
{
  "name": "CSS UI Resize",
  "property": "cssresize",
  "tags": ["css"],
  "notes": [{
    "name": "W3C Specification",
    "href": "http://www.w3.org/TR/css3-ui/#resize"
  },{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/CSS/resize"
  }]
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('cssresize', testAllProps('resize'));
});
