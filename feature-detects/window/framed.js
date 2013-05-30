/*!
{
  "name": "Framed window",
  "property": "framed",
  "tags": ["window"]
}
!*/
/* DOC

Tests if page is iframed.

*/
define(['Modernizr'], function( Modernizr ) {
  // github.com/Modernizr/Modernizr/issues/242

  Modernizr.addTest('framed', window.location != top.location);
});
