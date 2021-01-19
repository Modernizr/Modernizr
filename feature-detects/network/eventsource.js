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
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('eventsource', 'EventSource' in _globalThis);

export default Modernizr.eventsource
