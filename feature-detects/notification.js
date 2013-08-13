/*!
{
  "name": "Notification",
  "property": "notification",
  "caniuse": "notifications",
  "authors": ["Theodoor van Donge", "Hendrik Beskow"],
  "notes": [{
    "name": "HTML5 Rocks tutorial",
    "href": "http://www.html5rocks.com/en/tutorials/notifications/quick/"
  },{
    "name": "W3C spec",
    "href": "www.w3.org/TR/notifications/"
  }],
  "polyfills": ["desktop-notify", "html5-notifications"]
}
!*/
/* DOC

Detects support for the Notifications API

*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('notification', 'Notification' in window && 'permission' in window.Notification && 'requestPermission' in window.Notification);
});
