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
/* DOC

Detect support for the `contains` attribute of a DOM node.

You might want to test this since Mozilla implemented this feature quite late.  
(Firefox 9.0/Gecko 9.0 which was released in late 2011)

*/
define(['Modernizr', 'docElement'], function( Modernizr, docElement ) {
  Modernizr.addTest('nodecontains', 'contains' in docElement);
});
