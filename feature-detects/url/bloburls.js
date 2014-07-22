/*!
{
  "name": "Blob URLs",
  "property": "bloburls",
  "caniuse": "bloburls",
  "notes": [{
    "name": "W3C Working Draft",
    "href": "http://www.w3.org/TR/FileAPI/#creating-revoking"
  }],
  "tags": ["file", "url"],
  "authors": ["Ron Waldon (@jokeyrhyme)"]
}
!*/
/* DOC
Detects support for creating Blob URLs
*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('bloburls', 'URL' in window && 'revokeObjectURL' in URL && 'createObjectURL' in URL);
});
