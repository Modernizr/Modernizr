/*!
{
  "name": "Notifications",
  "property": "notification",
  "caniuse": "notifications",
  "authors": ["Theodoor van Donge"],
  "notes": [{
    "name": "HTML5 Rocks tutorial",
    "href": "http://www.html5rocks.com/en/tutorials/notifications/quick/"
  },{
    "name": "W3C spec",
    "href": "http://dev.w3.org/2006/webapi/WebNotifications/publish/Notifications.html#idl-if-Notification"
  }],
  "polyfills": ["notificationjs"]
}
!*/
/* DOC

Detects support for the Notifications API, for notifying the user of events regardless of which tab has focus.

*/
define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  Modernizr.addTest('notification', !!prefixed('Notifications', window));
});
