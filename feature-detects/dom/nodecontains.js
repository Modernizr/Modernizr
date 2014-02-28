/*!
{
  "name": "Node.contains",
  "property": "nodecontains",
  "tags": ["dom"],
  "authors": ["aaronk6"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Node.contains"
  },{
    "name": "W3C DOM4",
    "href": "http://www.w3.org/TR/domcore/#dom-node-contains"
  }]
}
!*/
define(['Modernizr', 'docElement'], function( Modernizr, docElement ) {
  Modernizr.addTest('nodecontains', 'contains' in docElement);
});
