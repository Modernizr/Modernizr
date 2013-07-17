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
        isSupported = !!(/* Safari, Chrome, Firefox */window.Notification ||
        /* Chrome & ff-html5notifications plugin */window.webkitNotifications ||
        /* Firefox Mobile */navigator.mozNotification ||
        /* IE9+ */(window.external && window.external.msIsSiteMode() !== undefined));
      } catch(e) {}
      return isSupported;
  });
});
