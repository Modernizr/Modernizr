/*!
{
  "name": "Message Channel",
  "property": "messagechannel",
  "authors": ["Raju Konga (@kongaraju)"],
  "caniuse": "channel-messaging",
  "tags": ["performance", "messagechannel"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/2011/WD-webmessaging-20110317/#message-channels"
  }, {
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API/Using_channel_messaging"
  }]
}
!*/
/* DOC
Detects support for Message Channels, a way to communicate between different browsing contexts like iframes, workers, etc..
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('messagechannel', 'MessageChannel' in window);
});
