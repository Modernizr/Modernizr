/*!
{
  "name": "XML HTTP Request Level 2 XHR2",
  "property": "xhr2",
  "tags": ["network"],
  "notes": [{
    "name": "W3 Spec",
    "href": "http://www.w3.org/TR/XMLHttpRequest2/"
  },{
    "name": "Details on Related Github Issue",
    "href": "http://github.com/Modernizr/Modernizr/issues/385"
  }]
}
!*/
/* DOC

Tests for XHR2.
*/
define(['Modernizr'], function( Modernizr ) {
  // all three of these details report consistently across all target browsers:
  //   !!(window.ProgressEvent);
  //   !!(window.FormData);
  //   window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest;
  Modernizr.addTest('xhr2', 'FormData' in window);
});
