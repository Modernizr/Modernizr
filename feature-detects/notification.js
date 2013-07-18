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
  "polyfills": ["desktop-notify"]
}
!*/
/* DOC

Detects support for the Notifications API

*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('notification', function() {
      var isSupported = false;
      try {
        isSupported = !!(/* Safari, Firefox */window.Notification && window.Notification.permission && window.Notification.requestPermission);
      } catch(e) {}
      return isSupported;
  });
});
