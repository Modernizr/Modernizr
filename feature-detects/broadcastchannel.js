/*!
{
  "name": "Broadcast Channel",
  "property": "broadcastchannel",
  "authors": ["Alex Neises (@AlexNeises)"],
  "caniuse": "broadcastchannel",
  "tags": ["performance", "broadcastchannel"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel"
  }]
}
!*/
/* DOC
Detects support for Broadcast Channels, allowing communication between different documents in different windows, tabs, frames, or iframes of the same origin.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('broadcastchannel', 'BroadcastChannel' in window);
});
