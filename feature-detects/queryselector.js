/*!
{
  "name": "QuerySelector",
  "property": "queryselector",
  "caniuse": "queryselector",
  "tags": ["queryselector"],
  "authors": ["Andrew Betts (@triblondon)"]
}
!*/
/* DOC

Detects support for querySelector.

*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('queryselector', 'querySelector' in document);
});
