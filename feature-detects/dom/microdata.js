/*!
{
  "name": "microdata",
  "property": "microdata",
  "tags": ["dom"],
  "notes": [{
    "name": "W3 Spec",
    "href": "http://www.w3.org/TR/html5/microdata.html"
  }]
}
!*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('microdata', 'getItems' in document);
});
