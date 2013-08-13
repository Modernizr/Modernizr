/*!
{
  "name": "Server Sent Events",
  "property": "eventsource",
  "tags": ["network"],
  "notes": [{
    "name": "W3 Spec",
    "href": "http://dev.w3.org/html5/eventsource/"
  }]
}
!*/
/* DOC

Tests for server sent events aka eventsource.

*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('eventsource', 'EventSource' in window);
});
