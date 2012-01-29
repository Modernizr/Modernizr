// http://dev.w3.org/2006/webapi/WebNotifications/publish/Notifications.html
// http://dev.chromium.org/developers/design-documents/desktop-notifications/api-specification

// the current webkit implementation is `webkitNotifications.createHTMLNotification`
// however the spec uses `new Notification()`

// we test for both, it up to you to use the right one with the correct signature.


Modernizr.addTest('notifications', function(){ 
  return !!Modernizr.prefixed('Notification', window) || !!Modernizr.prefixed('notifications', window);
}