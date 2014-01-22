/*!
{
  "name": "QuerySelector",
  "property": "queryselector",
  "caniuse": "queryselector",
  "tags": ["queryselector"],
  "authors": ["Andrew Betts (@triblondon)"],
  "notes": [{
    "name" : "W3C Selectors reference",
    "href": "http://www.w3.org/TR/selectors-api/#queryselectorall"
  }]
}
!*/
/* DOC

Detects support for querySelector.

*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('queryselector', 'querySelector' in document && 'querySelectorAll' in document);
});
