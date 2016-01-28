/*!
{
  "name": "Message Channel",
  "property": "MessageChannel",
  "authors": ["Raju Konga [kongaraju]"],
  "caniuse" : "MessageChannel",
  "tags": ["performance", "messagechannel"],
  "notes": [{
    "name": "W3C Reference",
    "href": "https://www.w3.org/TR/2011/WD-webmessaging-20110317/#message-channels"
  }, {
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API/Using_channel_messaging"
  }],
}
!*/
/* DOC
Detects support for  `Message Channel` API from the Channel Messaging spec. Message Channels  provide a simple way for communication between threads.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('messagechannel', 'MessageChannel' in window);
});
