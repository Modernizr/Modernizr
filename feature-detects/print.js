/*!
{
  "name": "Print API",
  "property": "print",
  "caniuse": "print",
  "tags": ["print"],
  "notes": [{
    "name": "MDN",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/window.print"
  }]
}
!*/
/* DOC

Detects support for the Print API.

*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('print', 'print' in window);
});
