/*!
{
  "name": "Server Sent Events",
  "property": "eventsource",
  "tags": ["network"],
  "builderAliases": ["network_eventsource"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events"
  }]
}
!*/
/* DOC
Tests for server sent events aka eventsource.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('eventsource', 'EventSource' in window);
});
