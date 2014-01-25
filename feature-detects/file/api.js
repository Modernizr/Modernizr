/*!
{
  "name": "File API",
  "property": "filereader",
  "caniuse": "fileapi",
  "notes": [{
    "name": "W3C Working Draft",
    "href": "http://www.w3.org/TR/FileAPI/"
  }],
  "tags": ["file"]
}
!*/
/* DOC

`filereader` tests for the File API specification

Tests for objects specific to the File API W3C specification without
being redundant (don't bother testing for Blob since it is assumed
to be the File object's prototype.)

*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('filereader', !!('File' in window && 'FileList' in window && 'FileReader' in  window));
});
