/*!
{
  "name": "contains",
  "property": "contains",
  "tags": ["dom"],
  "authors": ["aaronk6"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Node.contains"
  }]
}
!*/
define(['Modernizr', 'docElement'], function( Modernizr, docElement ) {
  Modernizr.addTest('contains', 'contains' in docElement);
});
